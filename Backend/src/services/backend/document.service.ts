import { DocumentItem } from '../../types';
import { getSupabase, isSupabaseConfigured } from '../supabase';
import { store } from '../store';
import { authBackendService } from './auth.service';
import { authorization } from './authorization';
import { validation } from './validation';
import { DayflowError } from './errors';

export const documentBackendService = {
  /**
   * Get employee documents with strict isolation
   */
  async getDocuments(employeeId?: string): Promise<DocumentItem[]> {
    const caller = await authBackendService.getCurrentUser();
    const targetId = employeeId || caller.id;

    authorization.assertCanAccessEmployee(caller, targetId);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('documents').select('*').order('uploaded_at', { ascending: false });
        if (targetId) {
          query = query.eq('employee_id', targetId);
        }
        const { data, error } = await query;
        if (data && !error && data.length > 0) {
          return data as DocumentItem[];
        }
      } catch (err) {
        console.warn('[Dayflow Documents] Remote fetch fallback:', err);
      }
    }

    return store.getDocuments(targetId);
  },

  async getMyDocuments(): Promise<DocumentItem[]> {
    const caller = await authBackendService.getCurrentUser();
    return this.getDocuments(caller.id);
  },

  async getEmployeeDocuments(employeeId: string): Promise<DocumentItem[]> {
    return this.getDocuments(employeeId);
  },

  /**
   * Upload document with validation and ownership check
   */
  async uploadDocument(payload: Omit<DocumentItem, 'id' | 'uploaded_at'>): Promise<DocumentItem> {
    const caller = await authBackendService.getCurrentUser();
    const employeeId = payload.employee_id || caller.id;

    authorization.assertCanAccessEmployee(caller, employeeId);
    validation.validateDocumentMetadata(payload.title, payload.category, payload.file_type);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const insertDoc = {
          employee_id: employeeId,
          employee_name: payload.employee_name || caller.full_name,
          title: payload.title.trim(),
          category: payload.category,
          file_size: payload.file_size || '1.2 MB',
          file_type: payload.file_type || 'PDF',
          url: payload.url || '#',
          status: payload.status || 'verified',
          uploaded_at: new Date().toISOString().split('T')[0]
        };

        const { data, error } = await supabase
          .from('documents')
          .insert([insertDoc])
          .select('*')
          .single();

        if (data && !error) {
          store.uploadDocument(payload);
          return data as DocumentItem;
        }
      } catch (err) {
        console.warn('[Dayflow Documents] Remote upload fallback:', err);
      }
    }

    return store.uploadDocument(payload);
  },

  /**
   * Delete document with ownership check
   */
  async deleteDocument(documentId: string): Promise<void> {
    const caller = await authBackendService.getCurrentUser();
    const all = store.getDocuments();
    const doc = all.find((d) => d.id === documentId);
    if (doc) {
      authorization.assertCanAccessEmployee(caller, doc.employee_id);
    }

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('documents')
          .delete()
          .eq('id', documentId);
      } catch (err) {
        console.warn('[Dayflow Documents] Remote delete fallback:', err);
      }
    }

    store.deleteDocument(documentId);
  },

  /**
   * Generates a signed download URL for private documents
   */
  async downloadDocument(documentId: string): Promise<{ url: string; fileName: string }> {
    const caller = await authBackendService.getCurrentUser();
    const all = store.getDocuments();
    const doc = all.find((d) => d.id === documentId);
    if (!doc) {
      throw new DayflowError('NOT_FOUND', 'Document not found.');
    }

    authorization.assertCanAccessEmployee(caller, doc.employee_id);

    const supabase = getSupabase();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.storage
          .from('employee-documents')
          .createSignedUrl(`${doc.employee_id}/${doc.id}.${doc.file_type.toLowerCase()}`, 60);

        if (data?.signedUrl && !error) {
          return { url: data.signedUrl, fileName: doc.title };
        }
      } catch (err) {
        console.warn('[Dayflow Documents] Signed URL fallback:', err);
      }
    }

    return { url: doc.url || '#', fileName: doc.title };
  }
};

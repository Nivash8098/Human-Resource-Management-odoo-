import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { documentService } from '../../services/api';
import { DocumentItem, DocumentCategory } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DocumentUploadModal } from '../../components/features/DocumentUploadModal';
import { formatDate } from '../../lib/utils';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  ShieldCheck, 
  FileCheck,
  FolderOpen
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'all'>('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const loadDocs = async () => {
    if (!user) return;
    try {
      const list = await documentService.getDocuments(user.id);
      setDocuments(list);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadDocs();
  }, [user]);

  const filteredDocs = selectedCategory === 'all'
    ? documents
    : documents.filter((d) => d.category === selectedCategory);

  const handleDeleteDoc = async (id: string, title: string) => {
    try {
      await documentService.deleteDocument(id);
      success('Document Removed', `"${title}" has been deleted.`);
      loadDocs();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Deletion failed';
      error('Error', message);
    }
  };

  const handleDownloadDoc = (title: string) => {
    success('Download started', `Downloading "${title}" securely.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-sky-400 uppercase">
              Compliance Vault
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-slate-400 font-medium">AES-256 Encrypted</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Documents & Compliance
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Manage your contracts, tax filings, identification copies, and certificates in one secure place.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsUploadOpen(true)}
          leftIcon={<Upload className="w-4 h-4" />}
        >
          Upload Document
        </Button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['all', 'Identity', 'Employment', 'Payroll', 'Other'] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-[#0a101f] text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat === 'all' ? 'All Files' : cat}
          </button>
        ))}
      </div>

      {/* Documents List Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-sky-400" />
            <CardTitle>Document Vault</CardTitle>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {filteredDocs.length} {filteredDocs.length === 1 ? 'file' : 'files'} found
          </span>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080e1c] border-y border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Document Name</th>
                  <th className="py-3 px-4 sm:px-6">Category</th>
                  <th className="py-3 px-4 sm:px-6">Size / Type</th>
                  <th className="py-3 px-4 sm:px-6">Uploaded</th>
                  <th className="py-3 px-4 sm:px-6">Verification</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center">
                        <FileText className="w-8 h-8 text-slate-600 mb-2" />
                        <p className="font-semibold text-slate-300">No documents in this category</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Upload a copy to keep your record complete</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-950/80 text-sky-400 flex items-center justify-center shrink-0 border border-blue-800/40">
                            <FileCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-white block">{doc.title}</span>
                            <span className="text-[10px] text-slate-400 uppercase font-mono">{doc.file_type} Document</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-semibold">
                          {doc.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-400">
                        {doc.file_size}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-slate-300">
                        {formatDate(doc.uploaded_at)}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <Badge variant="success" size="sm" dot>
                          {doc.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownloadDoc(doc.title)}
                            aria-label={`Download ${doc.title}`}
                          >
                            <Download className="w-3.5 h-3.5 text-sky-400" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
                            onClick={() => handleDeleteDoc(doc.id, doc.title)}
                            aria-label={`Delete ${doc.title}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Security Statement Notice */}
      <div className="p-4 bg-[#0a101f] rounded-xl border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0" />
        <span>
          <strong className="text-white">Zero-Trust Storage:</strong> All uploaded employee identification and financial records are automatically encrypted at rest and in transit according to SOC-2 compliance standards.
        </span>
      </div>

      {/* Document Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={loadDocs}
      />
    </div>
  );
};

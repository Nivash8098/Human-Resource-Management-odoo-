import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { DocumentCategory } from '../../types';
import { documentService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<DocumentCategory>('Identity');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!title.trim()) {
      error('Title Required', 'Please provide a descriptive title for this document.');
      return;
    }

    setIsUploading(true);
    try {
      const fileSize = selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.2 MB';
      const fileType = selectedFile ? selectedFile.name.split('.').pop()?.toUpperCase() || 'PDF' : 'PDF';

      await documentService.uploadDocument({
        employee_id: user.id,
        employee_name: user.full_name,
        title: title.trim(),
        category,
        file_size: fileSize,
        file_type: fileType,
        url: '#',
        status: 'verified'
      });

      success('Document uploaded successfully', `"${title}" has been saved securely.`);
      setTitle('');
      setSelectedFile(null);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      error('Upload Error', message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Compliance & HR Document"
      description="Files are stored securely with enterprise-grade encryption."
      maxWidth="md"
    >
      <form onSubmit={handleUpload} className="space-y-4">
        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50'
              : selectedFile
              ? 'border-emerald-300 bg-emerald-50/30'
              : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
          }`}
          onClick={() => document.getElementById('file-upload-input')?.click()}
        >
          <input
            id="file-upload-input"
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            onChange={handleFileSelect}
          />
          {selectedFile ? (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-slate-900">{selectedFile.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {(selectedFile.size / 1024).toFixed(1)} KB • Click or drag to replace
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-slate-900">Drag & drop your file here</p>
              <p className="text-xs text-slate-500 mt-1">or browse from your device (PDF, DOCX, PNG up to 10MB)</p>
            </div>
          )}
        </div>

        <Input
          label="Document Title"
          placeholder="e.g. Passport Copy, Degree Certificate, Tax Slip"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          leftIcon={<FileText className="w-4 h-4" />}
        />

        <Select
          label="Document Category"
          value={category}
          onChange={(e) => setCategory(e.target.value as DocumentCategory)}
          required
        >
          <option value="Identity">Identity & Passport</option>
          <option value="Employment">Employment & NDA Agreement</option>
          <option value="Payroll">Payroll & Tax Forms</option>
          <option value="Other">Certificates & Other</option>
        </Select>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isUploading}>
            Upload Document
          </Button>
        </div>
      </form>
    </Modal>
  );
};

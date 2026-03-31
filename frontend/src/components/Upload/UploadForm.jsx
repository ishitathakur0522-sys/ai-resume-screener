import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, X, Loader2, CheckCircle2 } from 'lucide-react';
import { uploadResumes } from '../../api';

const UploadForm = ({ onUploadComplete }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    setError('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] }
  });

  const removeFile = (e, index) => {
    e.stopPropagation();
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a job description.');
      return;
    }
    if (files.length === 0) {
      setError('Please upload at least one resume PDF.');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('jobDescription', jobDescription);
    files.forEach(file => {
      formData.append('resumes', file);
    });

    try {
      await uploadResumes(formData);
      onUploadComplete();
    } catch (err) {
      console.error(err);
      setError('Upload failed. Note: Ensure the Mock backend node server is running.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-start">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full max-w-4xl overflow-hidden card-hover">
        <div className="p-6 sm:p-8 md:p-10 flex flex-col gap-8">

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 mb-2">Evaluate Candidates</h2>
            <p className="text-slate-500">Provide the job requirements and upload resumes to let NexusAI match them.</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 rounded-md shadow-sm">
              {error}
            </div>
          )}

          {/* Job Description Input */}
          <div className="flex flex-col gap-3">
            <label className="font-semibold text-slate-700 flex items-center justify-between">
              <span>Job Description</span>
              <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded-full">Required</span>
            </label>
            <textarea
              className="w-full h-40 p-4 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all resize-y text-slate-700 placeholder:text-slate-400"
              placeholder="Paste the job description, required skills, and responsibilities here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {/* Drag & Drop Zone */}
          <div className="flex flex-col gap-3">
            <label className="font-semibold text-slate-700">Resumes (PDF)</label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[200px]
                 ${isDragActive ? 'border-primary-500 bg-primary-50 shadow-inner' : 'border-slate-300 hover:border-primary-400 bg-slate-50 hover:bg-slate-50/50'}
               `}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-primary-500">
                <UploadCloud size={32} />
              </div>

              {isDragActive ? (
                <p className="text-lg font-medium text-primary-600">Drop the PDFs here...</p>
              ) : (
                <div className="text-center">
                  <p className="text-lg font-medium text-slate-700 mb-1">Drag & drop resumes here</p>
                  <p className="text-sm text-slate-500 mb-4">or click to browse files</p>
                  <button type="button" className="btn-outline h-9 text-sm inline-flex">
                    Browse Files
                  </button>
                </div>
              )}
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg group hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <File size={20} className="text-primary-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-slate-700 truncate">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => removeFile(e, idx)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center sm:min-w-0 sm:min-h-0 sm:p-1"
                      title="Remove"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className={`btn-primary w-full sm:w-auto px-8 ${isUploading ? 'opacity-80 cursor-wait' : ''}`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Analyzing with AI...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  <span>Start Analysis</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UploadForm;

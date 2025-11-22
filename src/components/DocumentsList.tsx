'use client';

import React, { useState } from 'react';
import { File, Download, Trash2, Search, Filter } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  category: string;
}

interface DocumentsListProps {
  documents: Document[];
  onDeleteDocument: (documentId: string) => void;
}

const DocumentsList: React.FC<DocumentsListProps> = ({ documents, onDeleteDocument }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'HR Policies', 'Customer Service', 'Product Information', 'Technical Documentation', 'Legal & Compliance', 'General'];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type: string) => {
    return <File className="h-5 w-5 text-blue-500" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Document Library</h2>
          <span className="text-sm text-gray-500">
            {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'}
          </span>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[160px]"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="divide-y divide-gray-100">
        {filteredDocuments.length === 0 ? (
          <div className="p-8 text-center">
            <File className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== 'All' 
                ? 'No documents match your search criteria.' 
                : 'No documents uploaded yet. Upload your first document above.'}
            </p>
          </div>
        ) : (
          filteredDocuments.map((document) => (
            <div key={document.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {getFileIcon(document.type)}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {document.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {document.category}
                      </span>
                      <span className="text-xs text-gray-500">{document.size}</span>
                      <span className="text-xs text-gray-500">
                        Uploaded {formatDate(document.uploadDate)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDeleteDocument(document.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DocumentsList;

'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import FileUpload from '@/components/FileUpload';
import DocumentsList from '@/components/DocumentsList';

export default function KnowledgeBase() {
  const [selectedAgent, setSelectedAgent] = useState('All agents');
  const [documents, setDocuments] = useState([
    {
      id: '1',
      name: 'Employee Handbook 2024.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadDate: '2024-11-20',
      category: 'HR Policies'
    },
    {
      id: '2',
      name: 'Customer Service Guidelines.docx',
      type: 'DOCX',
      size: '1.2 MB',
      uploadDate: '2024-11-19',
      category: 'Customer Service'
    },
    {
      id: '3',
      name: 'Product FAQ.txt',
      type: 'TXT',
      size: '156 KB',
      uploadDate: '2024-11-18',
      category: 'Product Information'
    }
  ]);

  const handleFileUpload = (newDocument: any) => {
    setDocuments(prev => [newDocument, ...prev]);
  };

  const handleDeleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  return (
    <div className="h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="ml-64 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <DashboardHeader selectedAgent={selectedAgent} onAgentChange={setSelectedAgent} />
        
        {/* Knowledge Base Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Knowledge Base</h1>
            <p className="text-gray-600">Upload and manage company documents for your agents to reference during customer interactions.</p>
          </div>

          {/* File Upload Section */}
          <div className="mb-8">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>

          {/* Documents List */}
          <div>
            <DocumentsList 
              documents={documents} 
              onDeleteDocument={handleDeleteDocument}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

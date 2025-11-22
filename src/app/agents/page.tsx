'use client';

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { useAgentConversation } from '@/hooks/useAgentConversation';
import { Mic, Square, Plus, MessageSquare } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Agent {
  id: string;
  elevenlabs_agent_id: string;
  name: string;
  extra_prompts: string;
  created_at: string;
}

export default function AgentsPage() {
  const [view, setView] = useState<'list' | 'create' | 'voice-chat'>('list');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedAgentName, setSelectedAgentName] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Agent creation form
  const [agentName, setAgentName] = useState('');
  const [extraPrompts, setExtraPrompts] = useState('');

  // Voice conversation hook
  const {
    startConversation,
    stopConversation,
    isConnected,
    isStreaming,
    messages: voiceMessages,
    currentUserTranscript,
    currentAgentResponse,
  } = useAgentConversation(selectedAgentId || '');

  // Ref for auto-scrolling messages
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (view === 'voice-chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [voiceMessages, currentUserTranscript, currentAgentResponse, view]);

  const fetchAgents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/agents`);
      const data = await response.json();
      setAgents(data.agents);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const handleCreateAgent = async () => {
    if (!agentName || !extraPrompts) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/agents/clone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_name: agentName,
          extra_prompts: extraPrompts,
        }),
      });

      if (response.ok) {
        alert('Agent created successfully!');
        setAgentName('');
        setExtraPrompts('');
        fetchAgents();
        setView('list');
      } else {
        alert('Failed to create agent');
      }
    } catch (error) {
      console.error('Error creating agent:', error);
      alert('Error creating agent');
    } finally {
      setLoading(false);
    }
  };

  const handleStartVoiceChat = async (agent: Agent) => {
    setSelectedAgentId(agent.elevenlabs_agent_id);
    setSelectedAgentName(agent.name);
    setView('voice-chat');
  };

  const handleEndVoiceChat = async () => {
    await stopConversation();
    setView('list');
    setSelectedAgentId(null);
    setSelectedAgentName('');
  };

  // Voice Chat View
  if (view === 'voice-chat') {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E8</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Voice Chat</h1>
                  <p className="text-sm text-gray-600">Talking with: {selectedAgentName}</p>
                </div>
              </div>
              <button
                onClick={handleEndVoiceChat}
                className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                End Chat
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-4">
              {voiceMessages.length === 0 && !isConnected && (
                <div className="text-center py-12">
                  <div className="bg-white border border-gray-200 rounded-lg p-8 inline-block">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Ready to start?
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Click "Start Conversation" to begin talking with your agent in real-time!
                    </p>
                  </div>
                </div>
              )}

              {voiceMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg px-6 py-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className="text-xs mt-2 opacity-70">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {currentUserTranscript && (
                <div className="flex justify-end">
                  <div className="max-w-xs md:max-w-md lg:max-w-lg px-6 py-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300">
                    <p className="text-xs font-semibold mb-1">Live Transcript:</p>
                    <p className="text-sm">{currentUserTranscript}</p>
                  </div>
                </div>
              )}

              {currentAgentResponse && (
                <div className="flex justify-start">
                  <div className="max-w-xs md:max-w-md lg:max-w-lg px-6 py-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-200">
                    <p className="text-xs font-semibold mb-1">Agent is saying:</p>
                    <p className="text-sm">{currentAgentResponse}</p>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white border-t border-gray-200 p-6">
            <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                {!isConnected ? (
                  <button
                    onClick={startConversation}
                    disabled={loading}
                    className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-lg transition-colors disabled:bg-gray-400 flex items-center gap-3"
                  >
                    <Mic className="w-5 h-5" />
                    <span>Start Conversation</span>
                  </button>
                ) : (
                  <button
                    onClick={stopConversation}
                    className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-lg transition-colors flex items-center gap-3"
                  >
                    <Square className="w-5 h-5" />
                    <span>Stop Conversation</span>
                  </button>
                )}
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-3">
                  <span className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
                  <span className="text-sm font-medium text-gray-700">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                {isStreaming && (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="h-2 w-1 bg-gray-900 rounded-full animate-pulse"></div>
                      <div className="h-2 w-1 bg-gray-900 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-2 w-1 bg-gray-900 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-xs text-gray-900 font-medium">Listening...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Create Agent View
  if (view === 'create') {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">E8</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Create New Agent</h1>
                  </div>
                  <button
                    onClick={() => setView('list')}
                    className="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Back
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agent Name
                    </label>
                    <input
                      type="text"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="My Custom Agent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Extra Prompts / Instructions
                    </label>
                    <textarea
                      value={extraPrompts}
                      onChange={(e) => setExtraPrompts(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent h-32"
                      placeholder="Add custom instructions for your agent..."
                    />
                  </div>

                  <button
                    onClick={handleCreateAgent}
                    disabled={loading}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400"
                  >
                    {loading ? 'Creating...' : 'Create Agent'}
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Agents List View
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">E8</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  AI Agents
                </h1>
              </div>
              <p className="text-gray-600 mb-6">
                Manage your AI voice conversation agents
              </p>

              <button
                onClick={() => setView('create')}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create New Agent
              </button>
            </div>

            {/* Agents List */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Agents</h2>

              {agents.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No agents yet. Create your first agent to get started!
                </p>
              ) : (
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {agent.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {agent.extra_prompts.substring(0, 100)}
                            {agent.extra_prompts.length > 100 ? '...' : ''}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Created: {new Date(agent.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleStartVoiceChat(agent)}
                          disabled={loading}
                          className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 flex items-center gap-2 ml-4"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Start Voice Chat</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

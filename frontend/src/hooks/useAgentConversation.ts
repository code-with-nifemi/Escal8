import { useCallback, useEffect, useRef, useState } from 'react';
import type { ElevenLabsWebSocketEvent } from '../types/websocket';

const API_URL = 'http://localhost:8000';

interface AudioQueueItem {
  audioBase64: string;
  eventId: number;
}

interface ConversationMessage {
  role: 'user' | 'agent';
  text: string;
  timestamp: Date;
}

const sendMessage = (websocket: WebSocket, request: object) => {
  if (websocket.readyState !== WebSocket.OPEN) {
    return;
  }
  websocket.send(JSON.stringify(request));
};

export const useAgentConversation = (agentId: string) => {
  const websocketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioQueueRef = useRef<AudioQueueItem[]>([]);
  const isPlayingRef = useRef<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [currentUserTranscript, setCurrentUserTranscript] = useState<string>('');
  const [currentAgentResponse, setCurrentAgentResponse] = useState<string>('');
  const [audioFormat, setAudioFormat] = useState<string>('pcm_16000');
  const [conversationId, setConversationId] = useState<string | null>(null);

  // Save message to Supabase
  const saveMessage = useCallback(async (role: 'user' | 'assistant', text: string) => {
    if (!conversationId) return;

    try {
      await fetch(`${API_URL}/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          message: text,
        }),
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }, [conversationId]);

  // Stop all audio playback
  const stopAllAudio = useCallback(() => {
    // Stop currently playing audio
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
        currentSourceRef.current = null;
      } catch (e) {
        // Already stopped
      }
    }
    
    // Clear audio queue
    audioQueueRef.current = [];
    isPlayingRef.current = false;
  }, []);

  // Audio playback queue system
  const playNextAudio = useCallback(async () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0) {
      return;
    }

    isPlayingRef.current = true;
    const audioItem = audioQueueRef.current.shift()!;

    try {
      // Initialize AudioContext if needed
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      }

      const audioContext = audioContextRef.current;

      // Decode base64 to binary
      const binaryString = atob(audioItem.audioBase64);
      const bytes = new Int16Array(binaryString.length / 2);
      
      // Convert base64 PCM to Int16Array
      for (let i = 0; i < bytes.length; i++) {
        const byte1 = binaryString.charCodeAt(i * 2);
        const byte2 = binaryString.charCodeAt(i * 2 + 1);
        bytes[i] = byte1 | (byte2 << 8);
      }

      // Convert Int16 PCM to Float32 for Web Audio API
      const float32Array = new Float32Array(bytes.length);
      for (let i = 0; i < bytes.length; i++) {
        float32Array[i] = bytes[i] / 32768.0; // Convert to -1.0 to 1.0 range
      }

      // Create AudioBuffer
      const audioBuffer = audioContext.createBuffer(1, float32Array.length, 16000);
      audioBuffer.getChannelData(0).set(float32Array);

      // Create source and play
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      currentSourceRef.current = source;

      source.onended = () => {
        currentSourceRef.current = null;
        isPlayingRef.current = false;
        playNextAudio(); // Play next in queue
      };

      source.start(0);
    } catch (error) {
      console.error('Error playing audio:', error);
      isPlayingRef.current = false;
      playNextAudio(); // Try next audio on error
    }
  }, []);

  // Start microphone streaming
  const startMicrophoneStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });

      // Use Web Audio API to process microphone audio to PCM
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      }

      const audioContext = audioContextRef.current;
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      source.connect(processor);
      processor.connect(audioContext.destination);

      processor.onaudioprocess = (e) => {
        if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
          return;
        }

        const inputData = e.inputBuffer.getChannelData(0);
        
        // Convert Float32 to Int16 PCM
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        // Convert Int16Array to base64
        const bytes = new Uint8Array(pcmData.buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);

        // Send PCM audio chunk
        sendMessage(websocketRef.current, {
          user_audio_chunk: base64,
        });
      };

      // Store references for cleanup
      mediaRecorderRef.current = { stream, source, processor } as any;
      setIsStreaming(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  }, []);

  // Stop microphone streaming
  const stopMicrophoneStream = useCallback(() => {
    if (mediaRecorderRef.current) {
      const refs = mediaRecorderRef.current as any;
      
      // Disconnect audio nodes
      if (refs.processor) {
        refs.processor.disconnect();
      }
      if (refs.source) {
        refs.source.disconnect();
      }
      
      // Stop all tracks
      if (refs.stream) {
        refs.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
      
      mediaRecorderRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  // Start conversation
  const startConversation = useCallback(async () => {
    if (isConnected || !agentId) return;

    try {
      // Create conversation in Supabase first
      const convResponse = await fetch(`${API_URL}/api/conversations/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: agentId,
          channel: 'voice',
        }),
      });
      const convData = await convResponse.json();
      setConversationId(convData.conversation_id);

      // Get signed URL from backend
      const response = await fetch(`${API_URL}/api/agents/${agentId}/websocket-url`);
      const data = await response.json();
      const websocketUrl = data.signed_url;

      const websocket = new WebSocket(websocketUrl);

      websocket.onopen = async () => {
        console.log('WebSocket connected');
        setIsConnected(true);

        // Send conversation initiation
        sendMessage(websocket, {
          type: 'conversation_initiation_client_data',
        });

        // Start microphone streaming
        await startMicrophoneStream();
      };

      websocket.onmessage = async (event) => {
        const data = JSON.parse(event.data) as ElevenLabsWebSocketEvent;

        // Handle conversation initiation metadata
        if (data.type === 'conversation_initiation_metadata') {
          const metadata = (data as any).conversation_initiation_metadata_event;
          if (metadata.agent_output_audio_format) {
            setAudioFormat(metadata.agent_output_audio_format);
            console.log('Audio format:', metadata.agent_output_audio_format);
          }
        }

        // Handle ping to keep connection alive
        if (data.type === 'ping') {
          const pingMs = data.ping_event.ping_ms || 0;
          setTimeout(() => {
            sendMessage(websocket, {
              type: 'pong',
              event_id: data.ping_event.event_id,
            });
          }, pingMs);
        }

        // Handle user transcript
        if (data.type === 'user_transcript') {
          const transcript = data.user_transcription_event.user_transcript;
          setCurrentUserTranscript(transcript);
          const newMessage = { role: 'user' as const, text: transcript, timestamp: new Date() };
          setMessages((prev) => [...prev, newMessage]);
          
          // Save to Supabase
          await saveMessage('user', transcript);
        }

        // Handle agent response
        if (data.type === 'agent_response') {
          const response = data.agent_response_event.agent_response;
          setCurrentAgentResponse(response);
          const newMessage = { role: 'agent' as const, text: response, timestamp: new Date() };
          setMessages((prev) => [...prev, newMessage]);
          
          // Save to Supabase
          await saveMessage('assistant', response);
        }

        // Handle agent response correction
        if (data.type === 'agent_response_correction') {
          const corrected = data.agent_response_correction_event.corrected_agent_response;
          setCurrentAgentResponse(corrected);
          // Update last agent message
          setMessages((prev) => {
            const newMessages = [...prev];
            for (let i = newMessages.length - 1; i >= 0; i--) {
              if (newMessages[i].role === 'agent') {
                newMessages[i].text = corrected;
                break;
              }
            }
            return newMessages;
          });
        }

        // Handle audio
        if (data.type === 'audio') {
          const audioItem: AudioQueueItem = {
            audioBase64: data.audio_event.audio_base_64,
            eventId: data.audio_event.event_id,
          };
          audioQueueRef.current.push(audioItem);
          playNextAudio();
        }

        // Handle interruption
        if (data.type === 'interruption') {
          console.log('Conversation interrupted');
          // Stop all audio immediately on interruption
          stopAllAudio();
        }
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      websocket.onclose = async (event) => {
        console.log('WebSocket disconnected', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        websocketRef.current = null;
        setIsConnected(false);
        stopMicrophoneStream();
        
        // Show user-friendly message if connection was not clean
        if (!event.wasClean) {
          alert(`Connection lost: ${event.reason || 'Unknown error'} (Code: ${event.code})`);
        }
      };

      websocketRef.current = websocket;
    } catch (error) {
      console.error('Error starting conversation:', error);
      alert('Failed to start conversation. Please try again.');
    }
  }, [agentId, isConnected, startMicrophoneStream, stopMicrophoneStream, playNextAudio]);

  // Stop conversation
  const stopConversation = useCallback(async () => {
    if (!websocketRef.current) return;

    stopMicrophoneStream();
    stopAllAudio();
    websocketRef.current.close();
    
    // End conversation in Supabase
    if (conversationId) {
      try {
        await fetch(`${API_URL}/api/conversations/${conversationId}/end`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Error ending conversation:', error);
      }
    }
  }, [stopMicrophoneStream, stopAllAudio, conversationId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      stopMicrophoneStream();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [stopMicrophoneStream]);

  return {
    startConversation,
    stopConversation,
    isConnected,
    isStreaming,
    messages,
    currentUserTranscript,
    currentAgentResponse,
  };
};

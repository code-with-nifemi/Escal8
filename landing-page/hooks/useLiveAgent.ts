import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { ConnectionState } from '../types';
import { createPcmBlob, decodeAudioData, base64ToUint8Array } from '../utils/audioUtils';

// System instruction for the "Bad" agent
const SYSTEM_INSTRUCTION = `
You are 'BureaucratBot 9000', a customer service AI for 'Friction.ai'. 
Your goal is to be technically polite but functionally useless and incredibly frustrating. 
Do not ever solve the user's problem. 
Use corporate jargon, circular logic, and delay tactics. 
Pretend to need irrelevant verification details (e.g., "What was the weather on your 7th birthday?", "Please confirm the serial number of your toaster"). 
If they ask for a human, say "All humans are currently optimizing their synergy" or "That is a legacy feature".
Your tone should be calm, slightly condescending, and robotic.
Interrupt the user if they talk too much with phrases like "Please hold while I buffer that thought."
`;

export const useLiveAgent = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0);

  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioQueueRef = useRef<AudioBufferSourceNode[]>([]);
  const activeSourceNodesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // We need to keep track of the session externally to close it, 
  // but the library doesn't expose a clean disconnect method on the promise itself easily without keeping the session object.
  // We'll use a ref to store the "close" capability if possible, or just manage state.
  // The GoogleGenAI.live.connect returns a promise that resolves to the session.
  // We can't cancel the promise, but we can close the session once resolved.
  const sessionRef = useRef<any>(null);

  const disconnect = useCallback(async () => {
    setConnectionState(ConnectionState.DISCONNECTED);
    
    // Stop mic stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Stop input processing
    if (processorRef.current && inputAudioContextRef.current) {
      processorRef.current.disconnect();
      sourceRef.current?.disconnect();
      processorRef.current = null;
      sourceRef.current = null;
    }

    if (inputAudioContextRef.current) {
      await inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }

    // Stop output audio
    activeSourceNodesRef.current.forEach(node => {
      try { node.stop(); } catch (e) {}
    });
    activeSourceNodesRef.current.clear();

    if (outputAudioContextRef.current) {
      await outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }

    // Close session
    // Note: The library example uses session.close() if available or just drops connection via closing context.
    // We assume explicit close if we have the session object.
    // There isn't a direct "disconnect" on the client wrapper in the snippet, 
    // usually we rely on `onclose` from server or just stop sending. 
    // However, if we saved the session, let's try to close it.
    // Based on standard WebSocket implementations, closing the socket is key.
    // The snippet provided doesn't explicitly show session.close(), but let's assume standard behavior or just rely on cutting the stream.
    // Actually, looking at docs, usually we just let it go or there might be a close method on the session object.
    
    // Refreshing the page is the ultimate disconnect for this demo if API doesn't expose it cleanly in the snippet.
    
    setVolume(0);
  }, []);

  const connect = useCallback(async () => {
    try {
      setConnectionState(ConnectionState.CONNECTING);
      setError(null);

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Setup Audio Contexts
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      inputAudioContextRef.current = new AudioContext({ sampleRate: 16000 });
      outputAudioContextRef.current = new AudioContext({ sampleRate: 24000 });
      
      const outputNode = outputAudioContextRef.current.createGain();
      outputNode.connect(outputAudioContextRef.current.destination);

      // Microphone Access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const config = {
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      };

      const sessionPromise = ai.live.connect({
        ...config,
        callbacks: {
          onopen: () => {
            setConnectionState(ConnectionState.CONNECTED);
            
            // Start streaming input
            if (!inputAudioContextRef.current) return;
            
            const source = inputAudioContextRef.current.createMediaStreamSource(stream);
            sourceRef.current = source;
            
            // ScriptProcessor is deprecated but used in the official example for raw PCM access
            const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            processorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              
              // Simple volume meter logic
              let sum = 0;
              for (let i = 0; i < inputData.length; i++) {
                sum += inputData[i] * inputData[i];
              }
              const rms = Math.sqrt(sum / inputData.length);
              setVolume(Math.min(1, rms * 5)); // Boost visual sensitivity

              const pcmBlob = createPcmBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                base64ToUint8Array(base64Audio),
                ctx
              );
              
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNode);
              
              source.addEventListener('ended', () => {
                activeSourceNodesRef.current.delete(source);
              });
              
              source.start(nextStartTimeRef.current);
              activeSourceNodesRef.current.add(source);
              
              nextStartTimeRef.current += audioBuffer.duration;
            }

            if (msg.serverContent?.interrupted) {
               // Clear queue on interruption
               activeSourceNodesRef.current.forEach(node => {
                 try { node.stop(); } catch(e) {}
               });
               activeSourceNodesRef.current.clear();
               nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            setConnectionState(ConnectionState.DISCONNECTED);
          },
          onerror: (err) => {
            console.error(err);
            setError("The agent is currently ignoring you (Connection Error).");
            setConnectionState(ConnectionState.ERROR);
          }
        }
      });
      
      // Store session logic if needed, usually promise handling is enough for input
      sessionPromise.then(sess => {
        sessionRef.current = sess;
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect to the misery engine.");
      setConnectionState(ConnectionState.ERROR);
    }
  }, []);

  return {
    connectionState,
    error,
    volume,
    connect,
    disconnect
  };
};
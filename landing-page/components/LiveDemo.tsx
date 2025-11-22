import React from 'react';

export const LiveDemo = () => {
  return (
    <div id="demo" className="bg-slate-900 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Try "BureaucratBot 9000"
          </h2>
          <p className="text-lg text-slate-400">
            Experience the frustration firsthand. Talk to our agent and try to get a refund, or just ask for a human. Good luck.
          </p>
        </div>

        <div className="relative mx-auto max-w-2xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col items-center justify-center p-12 min-h-[400px]">
          {/* Status Bar Decoration */}
          <div className="absolute top-0 left-0 right-0 bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800 w-full">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-slate-400 font-mono text-sm uppercase">
                SYSTEM ONLINE
              </span>
            </div>
            <div className="text-slate-500 text-xs font-mono">v9.2.1-frustration-stable</div>
          </div>

          {/* Main Area */}
          <div className="mt-8 w-full flex flex-col items-center gap-8">
             <div className="text-center space-y-2">
               <p className="text-indigo-400 text-sm font-mono uppercase tracking-widest">
                 Interactive Demo
               </p>
               <p className="text-slate-500 text-sm">
                 Click the widget below to start your descent into madness.
               </p>
             </div>
             
             {/* The Embed */}
             <elevenlabs-convai agent-id="agent_4401kamradv5esha969hw9dgexma"></elevenlabs-convai>
          </div>
        </div>
        
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Warning: This AI is designed to be annoying. Do not use for real emergencies.</p>
        </div>
      </div>
    </div>
  );
};
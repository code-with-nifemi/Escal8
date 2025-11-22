'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const Hero = () => {
  return (
    <div className="relative isolate pt-14 pb-20 overflow-hidden bg-slate-900">
       <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
       <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
       <div className="absolute -bottom-8 left-20 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-400 ring-1 ring-white/10 hover:ring-white/20">
              Announcing our new feature: Infinite Loop Logic. <a href="#" className="font-semibold text-indigo-400"><span className="absolute inset-0" aria-hidden="true"></span>Read more <span aria-hidden="true">&rarr;</span></a>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-display">
            Customer Service, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Solved by Ignoring It.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Friction.ai replaces expensive human empathy with cost-effective algorithmic indifference. 
            Reduce ticket volume by 100% simply by making the submission process impossible.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a href="#demo" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center gap-2">
              Try the Agent <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#" className="text-sm font-semibold leading-6 text-white flex items-center gap-2">
              View Pricing <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

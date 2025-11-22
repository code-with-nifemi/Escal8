import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { LiveDemo } from './components/LiveDemo';
import { Menu, X, Bot } from 'lucide-react';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navigation */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
              <span className="sr-only">Friction.ai</span>
              <Bot className="h-8 w-8 text-indigo-500" />
              <span className="font-bold text-xl tracking-tight">Friction.ai</span>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-400"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <a href="#product" className="text-sm font-semibold leading-6 text-white hover:text-indigo-400 transition-colors">Product</a>
            <a href="#features" className="text-sm font-semibold leading-6 text-white hover:text-indigo-400 transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-semibold leading-6 text-white hover:text-indigo-400 transition-colors">Expensive Plans</a>
            <a href="#company" className="text-sm font-semibold leading-6 text-white hover:text-indigo-400 transition-colors">About Us</a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="#demo" className="text-sm font-semibold leading-6 text-white flex items-center gap-1 hover:text-indigo-400 transition-colors">
              Live Demo <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden" role="dialog" aria-modal="true">
            <div className="fixed inset-0 z-50"></div>
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-slate-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
                  <Bot className="h-8 w-8 text-indigo-500" />
                  <span className="font-bold text-xl">Friction.ai</span>
                </a>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-slate-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    <a href="#product" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-slate-800">Product</a>
                    <a href="#features" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-slate-800">Features</a>
                    <a href="#pricing" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-slate-800">Expensive Plans</a>
                  </div>
                  <div className="py-6">
                    <a href="#demo" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-slate-800">Live Demo</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        <Hero />
        <Features />
        <LiveDemo />
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:order-2">
              <p className="text-center text-xs leading-5 text-slate-500">
                &copy; {new Date().getFullYear()} Friction.ai. All rights reserved. We are not liable for emotional damage caused by our agents.
              </p>
            </div>
            <div className="mt-8 md:order-1 md:mt-0">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Bot className="h-6 w-6 text-slate-600" />
                <span className="text-slate-600 font-bold">Friction.ai</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
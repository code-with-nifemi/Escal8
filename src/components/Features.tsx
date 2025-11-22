'use client';

import React from 'react';
import { ShieldAlert, Clock, Repeat, ThumbsDown } from 'lucide-react';

const features = [
  {
    name: 'Circular Logic Engine',
    description: 'Our proprietary AI ensures that every answer leads back to the original question, trapping customers in a philosophically unbreakable loop.',
    icon: Repeat,
  },
  {
    name: 'Gaslighting-as-a-Service (GaaS)',
    description: 'Did the customer actually pay their bill? Our AI will convince them they didn't, and that they also never existed.',
    icon: ShieldAlert,
  },
  {
    name: 'Simulated Hold Times',
    description: 'We use advanced silence-generation technology to simulate being put on hold for hours, even when the system is idle.',
    icon: Clock,
  },
  {
    name: 'Empathy Nullification',
    description: 'Detects frustration in a user\'s voice and responds with increased cheerfulness and bureaucracy.',
    icon: ThumbsDown,
  },
];

export const Features = () => {
  return (
    <div id="features" className="bg-slate-950 py-24 sm:py-32 border-t border-slate-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">Deploy Hostility</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to lose customers fast
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-400">
            Why solve problems when you can simply exhaust the complainer? Our platform offers industry-leading retention rates (of revenue, not people).
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16 p-6 rounded-2xl bg-slate-900/50 hover:bg-slate-900 transition-colors border border-white/5">
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-400">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

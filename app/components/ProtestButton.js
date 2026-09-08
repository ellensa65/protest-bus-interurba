'use client';

import React, { useState } from 'react';
import ReportModal from './ReportModal';

export default function ProtestButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        className="w-full py-6 px-8 bg-accent hover:opacity-90 active:scale-95 transition-all rounded-2xl text-white font-black text-xl uppercase tracking-tighter animate-protest-pulse flex flex-col items-center gap-1 shadow-2xl shadow-accent/20 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <span>SOC A LA PARADA</span>
        <span className="text-sm opacity-80 font-bold">I EL BUS NO VE</span>
      </button>

      <ReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

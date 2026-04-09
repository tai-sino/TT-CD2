import { useState } from 'react';

export default function PhanCong() {
  const [tab, setTab] = useState('gvhd');

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Phân công GVHD / GVPB</h2>

      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <button
          onClick={() => setTab('gvhd')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'gvhd'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Phân công GVHD
        </button>
        <button
          onClick={() => setTab('gvpb')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'gvpb'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Phân công GVPB
        </button>
      </div>

      <div className="text-slate-500 text-sm">
        {tab === 'gvhd' ? 'Phân công GVHD — chức năng đang phát triển...' : 'Phân công GVPB — chức năng đang phát triển...'}
      </div>
    </div>
  );
}

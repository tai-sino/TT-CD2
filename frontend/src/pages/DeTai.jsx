import { useState } from 'react';

export default function DeTai() {
  const [tab, setTab] = useState('huongdan');

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Quản lý Đề tài</h2>
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <button
          onClick={() => setTab('huongdan')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'huongdan'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Hướng dẫn
        </button>
        <button
          onClick={() => setTab('phanbien')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === 'phanbien'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Phản biện
        </button>
      </div>
      <div className="text-slate-500 text-sm">
        {tab === 'huongdan'
          ? 'Nội dung Đề tài Hướng dẫn (tích hợp điểm tại đây)...'
          : 'Nội dung Đề tài Phản biện (tích hợp điểm tại đây)...'}
      </div>
    </div>
  );
}

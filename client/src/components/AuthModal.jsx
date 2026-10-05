import React, { useState, useEffect } from 'react';
import { UserCheck, Shield, Key, CheckCircle2, ChevronRight, X, Sparkles } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, currentUser, onSelectUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/auth/users')
        .then(res => res.json())
        .then(res => {
          if (res.success) setUsers(res.data);
        })
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="font-bold text-slate-900 text-base">Multi-Tenant Role Switcher & Authentication</h2>
              <p className="text-xs text-slate-500">Sanghi Brothers (Tata Motors Indore) Stakeholder Matrix</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* User Profiles Selection */}
        <div className="p-6 space-y-3">
          <p className="text-xs text-slate-600">
            Select a verified dealership or OEM role to experience role-based views, permissions, and dashboards:
          </p>

          <div className="space-y-2">
            {users.map((u) => (
              <div
                key={u.id}
                onClick={() => {
                  onSelectUser(u);
                  onClose();
                }}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${currentUser?.id === u.id ? 'bg-blue-50 border-blue-400 shadow-sm' : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                    {u.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{u.name}</span>
                      <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full border border-slate-300 font-bold">
                        {u.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{u.title}</p>
                    <p className="text-[10px] text-blue-600 font-mono mt-0.5">{u.email}</p>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

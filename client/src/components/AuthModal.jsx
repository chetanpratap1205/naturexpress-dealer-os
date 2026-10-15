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
              <p className="text-xs text-slate-500">Shyam Automotive (Tata Motors Scheme 140 Indore) Stakeholder Matrix</p>
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
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600">
            Select an executive, operational, or OEM role to switch dashboards, permissions, and workflow views:
          </p>

          {/* Quick Dealer Principal Top Banner */}
          {users.find(u => u.role === 'DEALER_PRINCIPAL') && (
            <div 
              onClick={() => {
                const dp = users.find(u => u.role === 'DEALER_PRINCIPAL');
                onSelectUser(dp);
                onClose();
              }}
              className="p-4 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-md cursor-pointer hover:shadow-lg transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="text-3xl p-2 bg-white/10 rounded-xl border border-white/20 backdrop-blur-xs">
                  👑
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-base">Shyam Singhal</span>
                    <span className="text-[10px] font-mono bg-blue-500/40 text-blue-100 px-2 py-0.5 rounded-full border border-blue-400/30 font-bold uppercase">
                      DEALER_PRINCIPAL / GM
                    </span>
                  </div>
                  <p className="text-xs text-blue-100 mt-0.5 font-medium">Managing Director & Dealer Principal</p>
                  <p className="text-[11px] text-blue-200/80 font-mono">md@shyamautomotive.com • Full P&L & Floor Control</p>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-lg bg-white text-blue-900 font-bold text-xs shadow-xs group-hover:bg-blue-50 transition-colors">
                Switch to DP ➔
              </span>
            </div>
          )}

          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pt-1">
            All Dealership & OEM Roles ({users.length})
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
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

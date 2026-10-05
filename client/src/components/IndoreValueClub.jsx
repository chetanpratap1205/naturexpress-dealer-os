import React, { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  Car, 
  Sparkles, 
  CheckCircle2, 
  UserPlus, 
  QrCode, 
  Percent, 
  Wrench,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function IndoreValueClub({ members, onEnrollMember }) {
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [model, setModel] = useState('Tata Nexon Diesel (2019 - 82,000 km)');
  const [plan, setPlan] = useState('Indore Value Club Gold');

  const handleEnroll = (e) => {
    e.preventDefault();
    if (!ownerName || !regNo) return;

    onEnrollMember({ ownerName, regNo, model, plan });
    setShowEnrollModal(false);
    setOwnerName('');
    setRegNo('');
    confetti({ particleCount: 110, spread: 75, origin: { y: 0.5 } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-50 via-white to-emerald-50 border border-teal-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-3 rounded-xl bg-teal-100 text-teal-700 border border-teal-200">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200 uppercase tracking-wider">
                  Post-Warranty Customer Win-Back Engine
                </span>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Recovers 62% Lost Out-of-Warranty Cars
                </span>
              </div>
              <h1 className="text-xl font-black text-slate-900 mt-1">
                Indore Value Club (Year 4+ Vehicle Retention Program)
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                Brings older Tata Nexon, Harrier, Hexa & Tiago owners back from local roadside garages with capped ₹1,999 periodic maintenance and genuine child-parts discounts.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 text-right shadow-sm">
            <span className="text-xs text-slate-500 font-medium block">Active Retained Members</span>
            <span className="text-2xl font-black text-teal-600 font-mono">1,240 Owners</span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
              +₹22 Lakhs/mo High-Margin Parts Revenue
            </span>
          </div>
        </div>
      </div>

      {/* Program Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="p-2.5 rounded-xl bg-teal-100 text-teal-700 w-fit">
            <Wrench className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Flat ₹1,999 Periodic Service</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eliminates high dealer labor stigma. Includes 36-point safety check + engine oil filter swap.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 w-fit">
            <Percent className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">15% Discount on Genuine Child-Parts</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Makes authorized repairs cheaper than local garages with 6-month OEM warranty on all parts.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 w-fit">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Free Indore Corridor Towing (RSA)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            24x7 roadside assistance covering AB Road, Bypass, Dewas, Pithampur & Mhow corridors.
          </p>
        </div>
      </div>

      {/* Members Registry & New Enrollment */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">Registered VIP Value Club Members</h3>
            <p className="text-xs text-slate-500">Active out-of-warranty customer retention roster</p>
          </div>
          <button
            onClick={() => setShowEnrollModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enroll Out-of-Warranty Vehicle</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((m) => (
            <div key={m.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between hover:bg-slate-100 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-slate-900">{m.ownerName}</span>
                  <span className="font-mono text-xs font-black text-teal-700 bg-teal-100 px-2 py-0.5 rounded border border-teal-200">
                    {m.regNo}
                  </span>
                </div>
                <span className="text-xs text-slate-700 block">{m.model}</span>
                <span className="text-[11px] text-slate-500 block">
                  Member ID: <strong className="text-slate-700">{m.memberNo}</strong> • Valid Till: <strong className="text-slate-700">{m.validTill}</strong>
                </span>
                <span className="text-[11px] text-emerald-700 font-bold block pt-1">
                  Customer Lifetime Savings: ₹{m.savingsToDate?.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 text-center shrink-0">
                <QrCode className="w-8 h-8 mx-auto text-teal-600" />
                <span className="text-[9px] font-mono block mt-1 font-bold text-teal-700">VIP PASS</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enrollment Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
              <Award className="w-5 h-5 text-teal-600" />
              <span>Enroll Vehicle in Indore Value Club</span>
            </h3>

            <form onSubmit={handleEnroll} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra Verma"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Registration Plate Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MP-09-WA-4411"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 uppercase font-mono font-bold focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Vehicle Model & Year</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Membership Tier</label>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-blue-500"
                >
                  <option>Indore Value Club Gold (₹1,999 Periodic Service + 15% Child-Parts)</option>
                  <option>Indore Value Club Platinum (Includes 2 Free Towing RSA + AC Disinfection)</option>
                </select>
              </div>

              <div className="flex space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-sm"
                >
                  Issue Digital VIP Pass ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

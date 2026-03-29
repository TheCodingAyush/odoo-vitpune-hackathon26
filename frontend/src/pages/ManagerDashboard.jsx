import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { CheckCircle, XCircle, AlertCircle, TrendingUp, Users } from 'lucide-react';

const ManagerDashboard = () => {
  const { user } = useAuth();
  
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 border-l-4 border-indigo-500 pl-4 mb-2">
            Manager Review
          </h2>
          <p className="text-slate-500 max-w-lg pl-4">Review team expenses. The system will automate routing based on company thresholds.</p>
        </div>
        <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center">
             <AlertCircle className="w-4 h-4 text-indigo-700"/>
          </div>
          <div>
            <p className="text-xs text-indigo-800 font-semibold uppercase">Pending Actions</p>
            <p className="text-lg font-bold text-indigo-900 leading-none mt-1">4</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Card 1 - Threshold Rule */}
        <div className="glass p-6 rounded-2xl relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
           <div className="flex justify-between items-start mb-6">
             <div className="flex space-x-4">
               <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center border border-indigo-200 shadow-inner">
                 <span className="font-bold text-indigo-700">TB</span>
               </div>
               <div>
                 <h4 className="font-bold text-lg">Tom Builder</h4>
                 <p className="text-sm text-slate-500">Marketing Offsite - Paris</p>
               </div>
             </div>
             <div className="text-right">
                <p className="font-bold text-xl text-slate-800">€2,450.00</p>
                <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-block mt-1">≈ ₹2,15,600</p>
             </div>
           </div>

           <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6 relative">
              <div className="flex items-center justify-between mb-2">
                 <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1">
                   <Users className="w-3 h-3"/> 60% Committee Rule Active
                 </span>
                 <span className="text-xs font-bold text-indigo-600">2 / 5 Approvals</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <p className="text-xs text-slate-600">Requires 3 out of 5 committee members to approve before CFO review.</p>
           </div>
           
           <div className="flex space-x-3">
              <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 transition-all">
                 <CheckCircle className="w-5 h-5" /> <span>Approve</span>
              </button>
              <button className="flex-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 font-semibold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all">
                 <XCircle className="w-5 h-5" /> <span>Reject</span>
              </button>
           </div>
        </div>

        {/* Expense Card 2 - VIP Rule */}
        <div className="glass p-6 rounded-2xl relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
           <div className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 pb-2 rounded-bl-xl border-b border-l border-amber-200">
             VIP ESCALATION
           </div>
           
           <div className="flex justify-between items-start mb-6">
             <div className="flex space-x-4">
               <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center border border-orange-200 shadow-inner">
                 <span className="font-bold text-orange-700">SR</span>
               </div>
               <div>
                 <h4 className="font-bold text-lg">Sarah Rogers</h4>
                 <p className="text-sm text-slate-500">Enterprise Server Hub</p>
               </div>
             </div>
             <div className="text-right">
                <p className="font-bold text-xl text-slate-800">$14,000.00</p>
                <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-block mt-1">≈ ₹11,62,000</p>
             </div>
           </div>

           <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                 <p className="text-sm font-semibold text-amber-800">Awaiting CFO Final Approval</p>
              </div>
              <p className="text-xs text-amber-700 mt-2">This expense exceeded $10k threshold. Standard workflow skipped in favor of VIP Review protocol.</p>
           </div>
           
           <div className="flex space-x-3">
              <button disabled className="flex-1 bg-slate-100 text-slate-400 font-semibold py-3 rounded-xl flex items-center justify-center space-x-2 border border-slate-200 cursor-not-allowed">
                 <CheckCircle className="w-5 h-5" /> <span>Approve (CFO Only)</span>
              </button>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ManagerDashboard;

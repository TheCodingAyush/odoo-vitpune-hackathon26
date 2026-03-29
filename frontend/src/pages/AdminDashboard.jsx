import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Plus, Building2, Check, ArrowRight } from 'lucide-react';

const AdminDashboard = () => {

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900 border-l-4 border-indigo-500 pl-4 mb-2">
          Admin Control Center
        </h2>
        <p className="text-slate-500 max-w-lg pl-4">Configure smart workflows and multi-currency rules for the entire organization.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="glass p-8 rounded-2xl border-t-4 border-indigo-500">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                 <Shield className="w-6 h-6 text-indigo-500" /> Active Workflows
               </h3>
               <button className="flex items-center gap-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg font-semibold transition-colors duration-200">
                 <Plus className="w-4 h-4" /> New Rule
               </button>
             </div>

             <div className="space-y-4">
               {/* 60% Rule Setup */}
               <div className="border border-slate-200 rounded-xl p-6 bg-white hover:border-indigo-300 transition-colors">
                 <div className="flex justify-between items-start mb-4">
                   <div>
                     <h4 className="font-bold text-lg text-slate-800">Department Hardware - The 60% Rule</h4>
                     <p className="text-sm text-slate-500 mt-1">Triggers when category is "IT Hardware"</p>
                   </div>
                   <div className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                     <Check className="w-3 h-3"/> Active
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-4 text-sm font-semibold text-slate-700 bg-slate-50 p-4 rounded-lg">
                    <div className="flex-1 flex flex-col items-center p-2 bg-white rounded border border-slate-100 shadow-sm">
                      <span className="text-xs text-slate-400 capitalize mb-1">Step 1</span>
                      Manager Review
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0"/>
                    <div className="flex-1 flex flex-col items-center p-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded shadow-sm">
                      <span className="text-xs text-indigo-400 capitalize mb-1">Step 2: Threshold</span>
                      Require 3/5 Approvals
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0"/>
                    <div className="flex-1 flex flex-col items-center p-2 bg-white rounded border border-slate-100 shadow-sm">
                      <span className="text-xs text-slate-400 capitalize mb-1">Final</span>
                      Finance Release
                    </div>
                 </div>
               </div>
               
               {/* VIP Rule Setup */}
               <div className="border border-slate-200 rounded-xl p-6 bg-white hover:border-indigo-300 transition-colors relative overflow-hidden">
                 <div className="absolute top-0 right-0 bg-amber-500 h-full w-2"></div>
                 <div className="flex justify-between items-start mb-4">
                   <div>
                     <h4 className="font-bold text-lg text-slate-800">VIP Escalation Protocol</h4>
                     <p className="text-sm text-slate-500 mt-1">Triggers for amounts &gt; $10,000</p>
                   </div>
                   <div className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                     <Check className="w-3 h-3"/> Active
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-4 text-sm font-semibold text-slate-700 bg-slate-50 p-4 rounded-lg">
                    <div className="flex-1 flex flex-col items-center p-2 bg-amber-50 border border-amber-200 text-amber-800 rounded shadow-sm">
                      <span className="text-xs text-amber-500 capitalize mb-1">Skip Hierarchy</span>
                      Direct CFO Routing
                    </div>
                 </div>
               </div>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-xl border border-slate-200">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex justify-center items-center">
                   <Building2 className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Company Profile</h3>
                  <p className="text-xs text-slate-400">Base Currency & Data</p>
                </div>
             </div>
             
             <div className="space-y-4 text-sm">
               <div>
                  <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Company Name</label>
                  <p className="font-semibold text-slate-800 bg-slate-50 p-2 rounded border border-slate-100">Global Tech Pvt Ltd</p>
               </div>
               <div>
                  <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Region (restcountries API)</label>
                  <p className="font-semibold text-slate-800 bg-slate-50 p-2 rounded border border-slate-100 flex items-center gap-2">🇮🇳 India</p>
               </div>
               <div>
                  <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Base Currency</label>
                  <p className="font-semibold text-slate-800 bg-slate-50 p-2 rounded border border-slate-100">INR (₹)</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;

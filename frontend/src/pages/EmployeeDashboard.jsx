import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setScanComplete(true);
    }, 2500); // simulate 2.5s OCR scanning
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
            Welcome back, {user.name.split(' ')[0]}
          </h2>
          <p className="text-slate-500 mt-1">Ready to submit a new expense?</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="glass p-8 rounded-2xl">
            <h3 className="text-xl font-semibold mb-4">Smart Receipt Scanner</h3>
            
            {!scanComplete ? (
              <div 
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${isUploading ? 'border-blue-400 bg-blue-50/50' : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50'}`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mb-4 max-w-sm overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: "100%" }} 
                        transition={{ duration: 2.5 }}
                        className="bg-blue-600 h-1.5 rounded-full"
                      />
                    </div>
                    <p className="text-blue-600 animate-pulse font-medium">Extracting data via OCR...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center cursor-pointer" onClick={handleUpload}>
                    <UploadCloud className="w-12 h-12 text-blue-500 mb-4" />
                    <p className="font-medium text-slate-700">Drop your receipt here, or click to browse</p>
                    <p className="text-sm text-slate-500 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                )}
              </div>
            ) : (
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-green-50 border border-green-200 p-6 rounded-xl">
                 <div className="flex justify-between items-center mb-4">
                   <div className="flex items-center gap-3">
                     <CheckCircle className="text-green-600 w-6 h-6"/>
                     <h4 className="font-semibold text-green-800">Scan Successful!</h4>
                   </div>
                   <button onClick={() => setScanComplete(false)} className="text-sm text-slate-500 hover:text-slate-800">Scan Another</button>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="text-xs text-slate-500 uppercase font-semibold">Merchant</label>
                      <input type="text" value="Uber Technologies" className="mt-1 w-full bg-white border border-slate-200 rounded-lg p-2 font-medium" readOnly />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 uppercase font-semibold">Amount (Auto-Detected)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 font-semibold text-slate-500">$</span>
                        <input type="text" value="45.00" className="mt-1 w-full bg-white border border-slate-200 rounded-lg py-2 pl-7 pr-3 font-medium text-slate-900" readOnly />
                      </div>
                      <p className="text-xs text-blue-600 font-medium mt-1">≈ ₹3,750.45 (INR base)</p>
                    </div>
                 </div>

                 <button className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors duration-200">
                   Submit for Approval
                 </button>
              </motion.div>
            )}
          </div>
        </div>
        
        <div className="glass p-6 rounded-2xl h-fit">
          <h3 className="font-semibold mb-4 text-slate-800">Recent Submissions</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-800">Team Lunch</p>
                  <p className="text-xs text-slate-500">Waiting on Manager</p>
                </div>
              </div>
              <span className="font-semibold text-sm">₹8,450</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-800">AWS Hosting</p>
                  <p className="text-xs text-green-600 font-medium">Approved</p>
                </div>
              </div>
              <span className="font-semibold text-sm">₹25,000</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeDashboard;

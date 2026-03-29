import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, ArrowRight, ShieldCheck, Zap, Briefcase } from 'lucide-react';

const AuthPage = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // For hackathon demo, let the user pick a role when signing in/up
  const [selectedRole, setSelectedRole] = useState('employee');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, selectedRole);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex overflow-hidden">
      {/* Left Side: Marketing/Value Prop */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-900 border-r border-slate-800 flex-col p-16 justify-between overflow-hidden">
        {/* Abstract Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
              SmartSpend
            </h1>
            <p className="text-indigo-200 text-sm font-medium uppercase tracking-wider">Expense Management System</p>
          </motion.div>
        </div>

        <div className="relative z-10 space-y-8 max-w-lg mb-20">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl font-bold text-white leading-tight"
          >
            Say goodbye to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">messy spreadsheets.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-indigo-100/80"
          >
            Automate approvals, leverage AI receipt scanning, and enforce smart hierarchy rules instantly across currencies.
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="grid grid-cols-2 gap-4 mt-8">
             <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-3">
               <div className="bg-blue-500/20 p-2 rounded-lg"><Zap className="text-blue-400 w-5 h-5"/></div>
               <span className="text-white font-medium text-sm">Automated Workflows</span>
             </div>
             <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-3">
               <div className="bg-emerald-500/20 p-2 rounded-lg"><ShieldCheck className="text-emerald-400 w-5 h-5"/></div>
               <span className="text-white font-medium text-sm">60% Committee Rules</span>
             </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Form & Controls */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-900 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-slate-400 text-sm">
              {isLogin ? 'Enter your details to access your dashboard.' : 'Start automating your company expenses today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Hackathon Role Selector Demo */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-indigo-500/30">
               <label className="block text-xs font-bold text-indigo-300 uppercase mb-3 flex items-center gap-2">
                 <Briefcase className="w-4 h-4" /> Demo Mode: Select Your Role
               </label>
               <div className="grid grid-cols-3 gap-2">
                 {['employee', 'manager', 'admin'].map((r) => (
                   <button
                     key={r}
                     type="button"
                     onClick={() => setSelectedRole(r)}
                     className={`py-2 px-1 text-xs font-semibold rounded-lg capitalize transition-colors border ${
                       selectedRole === r 
                         ? 'bg-indigo-600 border-indigo-500 text-white' 
                         : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                     }`}
                   >
                     {r}
                   </button>
                 ))}
               </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Email / Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">Remember me</label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">Forgot password?</a>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all group"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 relative">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
             <div className="relative flex justify-center text-sm">
               <span className="px-2 bg-slate-900 text-slate-500">Or continue with</span>
             </div>
          </div>
          <div className="mt-6 flex gap-3">
             <button className="flex-1 flex justify-center py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 transition-colors font-medium">Google</button>
             <button className="flex-1 flex justify-center py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 transition-colors font-medium">GitHub</button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {isLogin ? 'Sign up free' : 'Sign in instead'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;

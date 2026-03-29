import { useAuth } from '../../hooks/useAuth';
import { Home, FileText, CheckCircle, Settings, LogOut, Briefcase } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const { role, switchRole, logout, user } = useAuth();

  const getLinks = () => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Overview', icon: Home, path: '/' },
          { name: 'Company Rules', icon: Settings, path: '/rules' },
          { name: 'Users', icon: Briefcase, path: '/users' },
        ];
      case 'manager':
        return [
          { name: 'Dashboard', icon: Home, path: '/' },
          { name: 'Approvals', icon: CheckCircle, path: '/approvals' },
        ];
      case 'employee':
      default:
        return [
          { name: 'My Expenses', icon: Home, path: '/' },
          { name: 'New Expense', icon: FileText, path: '/new' },
        ];
    }
  };

  return (
    <div className="w-64 glass bg-white/80 border-r border-slate-200 flex flex-col justify-between">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-8">
          SmartSpend
        </h1>
        <nav className="space-y-2">
          {getLinks().map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-slate-200 space-y-4">
        <div className="flex flex-col mb-4">
          <span className="text-sm font-semibold">{user.name}</span>
          <span className="text-xs text-slate-500 capitalize">{role} Role</span>
        </div>
        
        <div className="flex gap-2 text-xs mb-4">
           <button onClick={() => switchRole('employee')} className={`px-2 py-1 rounded ${role === 'employee' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'bg-slate-100 hover:bg-slate-200'}`}>Emp</button>
           <button onClick={() => switchRole('manager')} className={`px-2 py-1 rounded ${role === 'manager' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'bg-slate-100 hover:bg-slate-200'}`}>Mgr</button>
           <button onClick={() => switchRole('admin')} className={`px-2 py-1 rounded ${role === 'admin' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'bg-slate-100 hover:bg-slate-200'}`}>Adm</button>
        </div>

        <button 
          onClick={logout} 
          className="w-full flex items-center justify-center space-x-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 transition-colors py-2 rounded-lg font-semibold text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

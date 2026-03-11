import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, FileText, LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface NavLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
}

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };
  
  const closeSidebar = (): void => {
    setIsOpen(false);
  };
  
  const NavLink = ({ to, icon: Icon, label }: NavLinkProps) => {
    const active = isActive(to);
    
    return (
      <Link
        to={to}
        onClick={closeSidebar}
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
          transition-all duration-200
          ${active 
            ? 'bg-dark-active text-dark-text-primary shadow-sm' 
            : 'text-dark-text-secondary hover:bg-dark-hover hover:text-dark-text-primary'
          }
        `}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        <span>{label}</span>
      </Link>
    );
  };
  
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-2 left-2 z-50 px-1.5 py-0.5 bg-dark-sidebar border border-dark-border rounded text-dark-text-primary hover:bg-dark-hover transition-colors text-sm font-bold shadow-sm"
      >
        {isOpen ? '<<' : '>>'}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-dark-sidebar border-r border-dark-border flex flex-col z-40
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo/Branding */}
        <div className="p-6 border-b border-dark-border">
          <Link to="/" onClick={closeSidebar} className="flex items-center gap-2">
            <div className="p-2 bg-input-focus/10 rounded-lg">
              <FileText className="h-6 w-6 text-input-focus" />
            </div>
            <div className="flex flex-col">
              <span className="text-dark-text-primary font-bold text-lg">Safety Form</span>
              <span className="text-dark-text-muted text-xs">Engine</span>
            </div>
          </Link>
        </div>
        
        {/* Main Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <div className="mb-6">
            <NavLink to="/" icon={Home} label="Home" />
            <NavLink to="/builder" icon={Settings} label="Form Builder" />
            <NavLink to="/renderer" icon={FileText} label="Fill Form" />
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

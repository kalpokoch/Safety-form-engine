import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, FileText } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="bg-input-focus text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold hover:text-blue-100 transition-colors flex items-center gap-2">
              <div className="p-1.5 bg-white/10 rounded-lg">
                <FileText className="h-5 w-5" />
              </div>
              Safety Form Engine
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                isActive('/') 
                  ? 'bg-white/20 text-white shadow-sm' 
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              to="/builder"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                isActive('/builder') 
                  ? 'bg-white/20 text-white shadow-sm' 
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Settings className="h-4 w-4" />
              Form Builder
            </Link>
            <Link
              to="/renderer"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                isActive('/renderer') 
                  ? 'bg-white/20 text-white shadow-sm' 
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <FileText className="h-4 w-4" />
              Fill Form
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              Safety Form Engine
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
            >
              Home
            </Link>
            <Link
              to="/builder"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
            >
              Form Builder
            </Link>
            <Link
              to="/renderer"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
            >
              Fill Form
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

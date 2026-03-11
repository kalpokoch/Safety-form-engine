import { Link } from 'react-router-dom';
import { Settings, FileText, Zap, Shield, Building } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Safety Form Engine
          </h1>
          <p className="text-xl text-gray-600">
            Dynamic form builder and submission system for safety inspections
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Admin Card */}
          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-all duration-200 border border-input-border">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4 border-2 border-input-focus">
                <Settings className="w-8 h-8 text-input-focus" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Form Builder
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Create custom safety forms with dynamic fields, validation rules, and conditional logic
              </p>
            </div>
            <Link
              to="/builder"
              className="block w-full text-center px-6 py-3 bg-input-focus text-white rounded-input hover:bg-blue-700 transition-all duration-200 font-semibold shadow-sm hover:shadow"
            >
              Go to Form Builder
            </Link>
          </div>

          {/* User Card */}
          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-all duration-200 border border-input-border">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4 border-2 border-input-success">
                <FileText className="w-8 h-8 text-input-success" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Fill Form
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Submit safety inspection forms with intelligent field validation and multi-branch support
              </p>
            </div>
            <Link
              to="/renderer"
              className="block w-full text-center px-6 py-3 bg-input-success text-white rounded-input hover:bg-green-700 transition-all duration-200 font-semibold shadow-sm hover:shadow"
            >
              Fill Out a Form
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-xl shadow-md p-8 border border-input-border">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Features
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-4 rounded-input bg-input-bg border border-input-border transition-all duration-200 hover:shadow-md">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-blue-50 rounded-full border-2 border-input-focus">
                  <Zap className="w-8 h-8 text-input-focus" />
                </div>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 text-lg">Dynamic Fields</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Support for text, number, select, radio, and video upload fields
              </p>
            </div>

            <div className="text-center p-4 rounded-input bg-input-bg border border-input-border transition-all duration-200 hover:shadow-md">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-blue-50 rounded-full border-2 border-input-focus">
                  <Shield className="w-8 h-8 text-input-focus" />
                </div>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 text-lg">Conditional Logic</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Show/hide fields based on other field values dynamically
              </p>
            </div>

            <div className="text-center p-4 rounded-input bg-input-bg border border-input-border transition-all duration-200 hover:shadow-md">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-blue-50 rounded-full border-2 border-input-focus">
                  <Building className="w-8 h-8 text-input-focus" />
                </div>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 text-lg">Multi-Branch</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Support for multiple branches and locations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

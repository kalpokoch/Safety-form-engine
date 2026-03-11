import { Link } from 'react-router-dom';
import { Settings, FileText, Zap, Shield, Building } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-5xl mx-auto px-6 py-8 pt-16 lg:pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-text-primary mb-2">
            Welcome to Safety Form Engine
          </h1>
          <p className="text-base text-dark-text-secondary">
            Dynamic form builder and submission system for safety inspections
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* Admin Card */}
          <div className="bg-dark-card rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-200 border border-dark-border hover:border-input-focus/50">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-input-focus/10 rounded-lg mb-3 border border-input-focus/20">
                <Settings className="w-6 h-6 text-input-focus" />
              </div>
              <h2 className="text-xl font-bold text-dark-text-primary mb-2">
                Form Builder
              </h2>
              <p className="text-sm text-dark-text-secondary leading-relaxed">
                Create custom safety forms with dynamic fields, validation rules, and conditional logic
              </p>
            </div>
            <Link
              to="/builder"
              className="block w-full text-center px-4 py-2 bg-input-focus text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow"
            >
              Go to Form Builder
            </Link>
          </div>

          {/* User Card */}
          <div className="bg-dark-card rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-200 border border-dark-border hover:border-input-success/50">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-input-success/10 rounded-lg mb-3 border border-input-success/20">
                <FileText className="w-6 h-6 text-input-success" />
              </div>
              <h2 className="text-xl font-bold text-dark-text-primary mb-2">
                Fill Form
              </h2>
              <p className="text-sm text-dark-text-secondary leading-relaxed">
                Submit safety inspection forms with intelligent field validation and multi-branch support
              </p>
            </div>
            <Link
              to="/renderer"
              className="block w-full text-center px-4 py-2 bg-input-success text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow"
            >
              Fill Out a Form
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-dark-card rounded-lg shadow-lg p-6 border border-dark-border">
          <h3 className="text-xl font-bold text-dark-text-primary mb-6">
            Key Features
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-dark-bg border border-dark-border transition-all duration-200 hover:border-input-focus/30">
              <div className="flex justify-center mb-3">
                <div className="p-2.5 bg-input-focus/10 rounded-lg border border-input-focus/20">
                  <Zap className="w-6 h-6 text-input-focus" />
                </div>
              </div>
              <h4 className="font-semibold text-dark-text-primary mb-1.5 text-center text-sm">Dynamic Fields</h4>
              <p className="text-xs text-dark-text-secondary leading-relaxed text-center">
                Support for text, number, select, radio, and video upload fields
              </p>
            </div>

            <div className="p-4 rounded-lg bg-dark-bg border border-dark-border transition-all duration-200 hover:border-input-focus/30">
              <div className="flex justify-center mb-3">
                <div className="p-2.5 bg-input-focus/10 rounded-lg border border-input-focus/20">
                  <Shield className="w-6 h-6 text-input-focus" />
                </div>
              </div>
              <h4 className="font-semibold text-dark-text-primary mb-1.5 text-center text-sm">Conditional Logic</h4>
              <p className="text-xs text-dark-text-secondary leading-relaxed text-center">
                Show/hide fields based on other field values dynamically
              </p>
            </div>

            <div className="p-4 rounded-lg bg-dark-bg border border-dark-border transition-all duration-200 hover:border-input-focus/30">
              <div className="flex justify-center mb-3">
                <div className="p-2.5 bg-input-focus/10 rounded-lg border border-input-focus/20">
                  <Building className="w-6 h-6 text-input-focus" />
                </div>
              </div>
              <h4 className="font-semibold text-dark-text-primary mb-1.5 text-center text-sm">Multi-Branch</h4>
              <p className="text-xs text-dark-text-secondary leading-relaxed text-center">
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

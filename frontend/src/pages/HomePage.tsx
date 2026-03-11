import { Link } from 'react-router-dom';
import { Settings, FileText, Zap, Shield, Building } from 'lucide-react';
import { Card, CardHeader, CardFooter, PageHeader, FeatureCard } from '../components/ui';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-5xl mx-auto px-6 py-8 pt-16 lg:pt-8">
        <PageHeader
          icon={Building}
          iconColor="text-input-focus"
          title="Welcome to Safety Form Engine"
          description="Dynamic form builder and submission system for safety inspections"
        />

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* Admin Card */}
          <Card variant="interactive">
            <CardHeader
              icon={Settings}
              iconColor="bg-input-focus/10 border-input-focus/20"
              title="Form Builder"
              description="Create custom safety forms with dynamic fields, validation rules, and conditional logic"
            />
            <CardFooter>
              <Link to="/builder" className="block w-full text-center px-4 py-2 bg-input-focus text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow">
                Go to Form Builder
              </Link>
            </CardFooter>
          </Card>

          {/* User Card */}
          <Card variant="interactive">
            <CardHeader
              icon={FileText}
              iconColor="bg-input-success/10 border-input-success/20"
              title="Fill Form"
              description="Submit safety inspection forms with intelligent field validation and multi-branch support"
            />
            <CardFooter>
              <Link to="/renderer" className="block w-full text-center px-4 py-2 bg-input-success text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow">
                Fill Out a Form
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Features Section */}
        <Card>
          <CardHeader title="Key Features" className="pb-2" />
          <div className="px-6 pb-6">
            <div className="grid md:grid-cols-3 gap-4">
              <FeatureCard
                icon={Zap}
                title="Dynamic Fields"
                description="Support for text, number, select, radio, and video upload fields"
              />
              <FeatureCard
                icon={Shield}
                title="Conditional Logic"
                description="Show/hide fields based on other field values dynamically"
              />
              <FeatureCard
                icon={Building}
                title="Multi-Branch"
                description="Support for multiple branches and locations"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;

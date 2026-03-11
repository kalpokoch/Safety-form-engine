import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import apiClient from '../api/client';
import { FormDefinition } from '../types';
import { Card, CardHeader, CardBody, CardFooter, Button, Alert, PageHeader } from '../components/ui';

const RendererPage = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<FormDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadForms = async () => {
      try {
        setLoading(true);
        // Note: We need a GET /forms/definitions endpoint to list all forms
        // For now, we'll handle the error gracefully
        const response = await apiClient.get('/forms/definitions');
        setForms(response.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'No forms available or failed to load forms';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadForms();
  }, []);

  const handleFormSelect = (formId: string) => {
    navigate(`/renderer/${formId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="text-lg text-dark-text-secondary">Loading forms...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-5xl mx-auto px-6 py-8 pt-16 lg:pt-8">
        <PageHeader
          icon={FileText}
          iconColor="text-input-success"
          title="Available Forms"
          description="Select a form to fill out"
        />

        {error && forms.length === 0 && (
          <Alert variant="warning" className="mb-8">
            {error}
            <p className="mt-2">
              To test the form renderer, you can manually navigate to:{' '}
              <code className="bg-yellow-500/20 px-2 py-1 rounded text-xs">/renderer/[form-id]</code>
            </p>
          </Alert>
        )}

        {forms.length === 0 && !error ? (
          <Card className="text-center p-8">
            <svg
              className="w-12 h-12 text-dark-text-muted mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-dark-text-primary mb-2">No Forms Available</h2>
            <p className="text-dark-text-secondary mb-4 text-sm">
              There are no forms created yet. Create one using the Form Builder.
            </p>
            <Button variant="success" onClick={() => navigate('/builder')}>
              Go to Form Builder
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {forms.map((form) => (
              <Card
                key={form.id}
                variant="interactive"
                clickable
                onClick={() => handleFormSelect(form.id!)}
              >
                <CardHeader title={form.title} description={form.description} />
                <CardBody className="pt-0">
                  <div className="flex justify-between items-center text-xs text-dark-text-muted mb-4">
                    <span>Version {form.version || 1}</span>
                    <span>{form.field_schema.fields.length} fields</span>
                  </div>
                </CardBody>
                <CardFooter>
                  <Button variant="primary" fullWidth>
                    Fill Out Form
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RendererPage;

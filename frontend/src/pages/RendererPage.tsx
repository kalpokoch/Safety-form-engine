import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { FormDefinition } from '../types';

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
      } catch (err: any) {
        setError('No forms available or failed to load forms');
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
    <div className="min-h-screen bg-dark-bg py-8 pt-16 lg:pt-8">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-6 text-dark-text-primary">Available Forms</h1>

        {error && forms.length === 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 px-4 py-3 rounded-lg mb-6">
            {error}
            <p className="mt-2 text-sm">
              To test the form renderer, you can manually navigate to:{' '}
              <code className="bg-yellow-500/20 px-2 py-1 rounded text-xs">/renderer/[form-id]</code>
            </p>
          </div>
        )}

        {forms.length === 0 && !error ? (
          <div className="bg-dark-card rounded-lg shadow-lg p-8 text-center border border-dark-border">
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
            <button
              onClick={() => navigate('/builder')}
              className="px-4 py-2 bg-input-success text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm"
            >
              Go to Form Builder
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {forms.map((form) => (
              <div
                key={form.id}
                className="bg-dark-card rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer border border-dark-border hover:border-input-focus/50"
                onClick={() => handleFormSelect(form.id!)}
              >
                <h2 className="text-xl font-semibold text-dark-text-primary mb-2">{form.title}</h2>
                {form.description && (
                  <p className="text-dark-text-secondary mb-4 text-sm">{form.description}</p>
                )}
                <div className="flex justify-between items-center text-xs text-dark-text-muted mb-4">
                  <span>Version {form.version || 1}</span>
                  <span>{form.field_schema.fields.length} fields</span>
                </div>
                <button className="w-full px-4 py-2 bg-input-focus text-white rounded-lg hover:bg-indigo-600 transition font-medium text-sm">
                  Fill Out Form
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RendererPage;

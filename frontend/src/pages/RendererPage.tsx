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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading forms...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Available Forms</h1>

        {error && forms.length === 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            {error}
            <p className="mt-2 text-sm">
              To test the form renderer, you can manually navigate to:{' '}
              <code className="bg-yellow-200 px-2 py-1 rounded">/renderer/[form-id]</code>
            </p>
          </div>
        )}

        {forms.length === 0 && !error ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Forms Available</h2>
            <p className="text-gray-600 mb-4">
              There are no forms created yet. Create one using the Form Builder.
            </p>
            <button
              onClick={() => navigate('/builder')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
            >
              Go to Form Builder
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {forms.map((form) => (
              <div
                key={form.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                onClick={() => handleFormSelect(form.id!)}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{form.title}</h2>
                {form.description && (
                  <p className="text-gray-600 mb-4">{form.description}</p>
                )}
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Version {form.version || 1}</span>
                  <span>{form.field_schema.fields.length} fields</span>
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium">
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

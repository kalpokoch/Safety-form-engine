import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import FieldRenderer from './FieldRenderer';
import { FormDefinition, Branch } from '../../types';
import apiClient from '../../api/client';

const FormRenderer = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const [formDefinition, setFormDefinition] = useState<FormDefinition | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const formData = watch();

  // Load form definition and branches
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load branches
        const branchesResponse = await apiClient.get('/metadata/branches');
        setBranches(branchesResponse.data);

        // Load form definition
        if (formId) {
          const formResponse = await apiClient.get(`/forms/definitions/${formId}`);
          setFormDefinition(formResponse.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load form');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [formId]);

  const onSubmit = async (data: any) => {
    if (!selectedBranch) {
      setError('Please select a branch');
      return;
    }

    setError('');
    setSuccess('');

    const submission = {
      branch_id: selectedBranch,
      submission_data: data,
    };

    try {
      setSubmitting(true);
      await apiClient.post(`/forms/${formId}/submission`, submission);
      setSuccess('Form submitted successfully!');

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit form');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading form...</div>
      </div>
    );
  }

  if (!formDefinition) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Form not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">{formDefinition.title}</h1>
      {formDefinition.description && (
        <p className="text-gray-600 mb-6">{formDefinition.description}</p>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md">
        {/* Branch Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Branch <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Select a branch --</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name} - {branch.location}
              </option>
            ))}
          </select>
        </div>

        {/* Render Form Fields */}
        <div className="space-y-4">
          {formDefinition.field_schema.fields.map((field) => (
            <Controller
              key={field.id}
              name={field.id}
              control={control}
              rules={{ required: field.required ? `${field.label} is required` : false }}
              render={({ field: { value, onChange } }) => (
                <FieldRenderer
                  field={field}
                  value={value}
                  onChange={onChange}
                  formData={formData}
                  error={errors[field.id]?.message as string}
                />
              )}
            />
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Form'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormRenderer;

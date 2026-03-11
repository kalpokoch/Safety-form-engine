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
      <div className="flex items-center justify-center min-h-screen bg-dark-bg">
        <div className="text-lg text-dark-text-secondary">Loading form...</div>
      </div>
    );
  }

  if (!formDefinition) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-bg">
        <div className="text-lg text-input-error">Form not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 pt-16 lg:pt-6 bg-dark-bg min-h-screen">
      <h1 className="text-3xl font-bold mb-2 text-dark-text-primary">{formDefinition.title}</h1>
      {formDefinition.description && (
        <p className="text-dark-text-secondary mb-6 text-sm">{formDefinition.description}</p>
      )}

      {error && (
        <div className="mb-4 p-3 bg-input-error/10 border border-input-error/50 text-input-error rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-input-success/10 border border-input-success/50 text-input-success rounded-lg text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-dark-card p-6 rounded-lg shadow-lg border border-dark-border">
        {/* Branch Selection */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-dark-text-primary mb-1.5">
            Select Branch <span className="text-input-error">*</span>
          </label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus focus:border-transparent text-dark-text-primary text-sm"
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
        <div className="space-y-3">
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
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-dark-border text-dark-text-secondary rounded-lg hover:bg-dark-hover transition font-medium text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-input-success text-white rounded-lg hover:bg-emerald-700 transition font-medium disabled:bg-gray-600 disabled:cursor-not-allowed text-sm"
          >
            {submitting ? 'Submitting...' : 'Submit Form'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormRenderer;

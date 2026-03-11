import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { FileText } from 'lucide-react';
import FieldRenderer from './FieldRenderer';
import { FormDefinition, Branch, FormValue } from '../../types';
import apiClient from '../../api/client';
import { Card, CardBody, Button, Alert, Select, PageHeader } from '../ui';

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
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load form';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [formId]);

  const onSubmit = async (data: Record<string, FormValue>) => {
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit form';
      setError(errorMessage);
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
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-4xl mx-auto px-6 py-8 pt-16 lg:pt-8">
        <PageHeader
          icon={FileText}
          iconColor="text-input-success"
          title={formDefinition.title}
          description={formDefinition.description}
        />

        {error && <Alert variant="error" message={error} className="mb-4" />}
        {success && <Alert variant="success" message={success} className="mb-4" />}

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Branch Selection */}
              <Select
                label="Select Branch"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                required
                className="mb-4"
              >
                <option value="">-- Select a branch --</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} - {branch.location}
                  </option>
                ))}
              </Select>

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
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="success"
            loading={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Form'}
          </Button>
        </div>
      </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default FormRenderer;

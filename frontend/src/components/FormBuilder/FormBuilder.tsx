import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Save, Settings, FileText } from 'lucide-react';
import FieldEditor from './FieldEditor';
import { FieldDefinition, FormDefinition } from '../../types';
import apiClient from '../../api/client';
import { Card, CardHeader, CardBody, Button, Alert, Input, Textarea, PageHeader } from '../ui';

const FormBuilder = () => {
  const navigate = useNavigate();
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [fields, setFields] = useState<FieldDefinition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const addField = () => {
    const newField: FieldDefinition = {
      id: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false,
      logicRules: [],
    };
    setFields([...fields, newField]);
  };

  const updateField = (index: number, updatedField: FieldDefinition) => {
    const updatedFields = [...fields];
    updatedFields[index] = updatedField;
    setFields(updatedFields);
  };

  const deleteField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formTitle.trim()) {
      setError('Form title is required');
      return;
    }

    if (fields.length === 0) {
      setError('At least one field is required');
      return;
    }

    // Validate field IDs are unique
    const fieldIds = fields.map((f) => f.id);
    const uniqueIds = new Set(fieldIds);
    if (fieldIds.length !== uniqueIds.size) {
      setError('Field IDs must be unique');
      return;
    }

    const formData: FormDefinition = {
      title: formTitle,
      description: formDescription,
      field_schema: {
        fields: fields,
      },
    };

    try {
      setLoading(true);
      const response = await apiClient.post('/forms/definitions', formData);
      setSuccess(`Form created successfully! ID: ${response.data.id}`);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormTitle('');
        setFormDescription('');
        setFields([]);
        setSuccess('');
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create form';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 pt-16 lg:pt-8">
      <PageHeader
        icon={Settings}
        iconColor="text-input-focus"
        title="Form Builder"
        description="Create custom safety forms with dynamic fields and logic"
      />

      {error && <Alert variant="error" message={error} className="mb-4" />}
      {success && <Alert variant="success" message={success} className="mb-4" />}

      <form onSubmit={handleSubmit}>
        {/* Form Metadata */}
        <Card className="mb-4">
          <CardHeader title="Form Details" />
          <CardBody>
            <Input
              label="Form Title"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g., Safety Inspection Form"
              showSuccess={!!formTitle}
              required
              className="mb-4"
            />

            <Textarea
              label="Description"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Brief description of the form..."
              showSuccess={!!formDescription}
              rows={3}
            />
          </CardBody>
        </Card>

        {/* Fields Section */}
        <Card className="mb-4">
          <CardHeader title="Form Fields">
            <Button
              type="button"
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={addField}
            >
              Add Field
            </Button>
          </CardHeader>
          <CardBody>
            {fields.length === 0 ? (
              <div className="text-center py-10 bg-dark-bg rounded-lg border-2 border-dashed border-dark-border">
                <FileText className="h-12 w-12 mx-auto text-dark-text-muted mb-3" />
                <p className="text-dark-text-secondary font-medium mb-1.5 text-sm">No fields added yet</p>
                <p className="text-dark-text-muted text-xs">Click "Add Field" to get started building your form</p>
              </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <FieldEditor
                  key={index}
                  field={field}
                  onUpdate={(updatedField) => updateField(index, updatedField)}
                  onDelete={() => deleteField(index)}
                  allFields={fields}
                />
              ))}
            </div>
          )}
          </CardBody>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
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
            icon={Save}
            loading={loading}
          >
            {loading ? 'Creating...' : 'Create Form'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormBuilder;

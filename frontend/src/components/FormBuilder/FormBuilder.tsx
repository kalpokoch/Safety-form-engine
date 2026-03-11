import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, AlertCircle, Plus, X, Save, FileQuestion, Settings } from 'lucide-react';
import FieldEditor from './FieldEditor';
import { FieldDefinition, FormDefinition } from '../../types';
import apiClient from '../../api/client';

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
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-dark-text-primary flex items-center gap-2.5">
          <Settings className="h-7 w-7 text-input-focus" />
          Form Builder
        </h1>
        <p className="text-dark-text-secondary text-sm mt-1.5 ml-10">Create custom safety forms with dynamic fields and logic</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-input-error/10 border border-input-error/50 text-input-error rounded-lg shadow-sm flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span className="font-medium text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-input-success/10 border border-input-success/50 text-input-success rounded-lg shadow-sm flex items-start gap-2.5">
          <Check className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span className="font-medium text-sm">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Form Metadata */}
        <div className="bg-dark-card p-6 rounded-lg shadow-lg mb-4 border border-dark-border">
          <h2 className="text-xl font-semibold mb-4 text-dark-text-primary">Form Details</h2>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-dark-text-primary mb-1.5">
              Form Title <span className="text-input-error">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus focus:border-transparent transition-all duration-200 text-dark-text-primary placeholder-dark-text-muted text-sm"
                placeholder="e.g., Safety Inspection Form"
                required
              />
              {formTitle && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                  <Check className="h-4 w-4 text-input-success" />
                </div>
              )}
            </div>
          </div>

          <div className="mb-0">
            <label className="block text-sm font-semibold text-dark-text-primary mb-1.5">
              Description
            </label>
            <div className="relative">
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus focus:border-transparent transition-all duration-200 min-h-[80px] resize-y text-dark-text-primary placeholder-dark-text-muted text-sm"
                placeholder="Brief description of the form..."
                rows={3}
              />
              {formDescription && (
                <div className="absolute top-2.5 right-2.5 pointer-events-none">
                  <Check className="h-4 w-4 text-input-success" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fields Section */}
        <div className="bg-dark-card p-6 rounded-lg shadow-lg mb-4 border border-dark-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-dark-text-primary">Form Fields</h2>
            <button
              type="button"
              onClick={addField}
              className="px-4 py-2 bg-input-focus text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 font-medium shadow-sm hover:shadow flex items-center gap-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              Add Field
            </button>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-10 bg-dark-bg rounded-lg border-2 border-dashed border-dark-border">
              <FileQuestion className="h-12 w-12 mx-auto text-dark-text-muted mb-3" />
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
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-dark-border text-dark-text-secondary rounded-lg hover:bg-dark-hover transition-all duration-200 font-medium flex items-center gap-2 shadow-sm text-sm"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-input-success text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 font-medium disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow text-sm"
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create Form
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormBuilder;

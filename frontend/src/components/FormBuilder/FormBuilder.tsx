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
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          <Settings className="h-8 w-8 text-input-focus" />
          Form Builder
        </h1>
        <p className="text-gray-600 mt-2 ml-11">Create custom safety forms with dynamic fields and logic</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-input-error text-red-700 rounded-input shadow-sm flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-input-error flex-shrink-0 mt-0.5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border-2 border-input-success text-green-700 rounded-input shadow-sm flex items-start gap-3">
          <Check className="h-5 w-5 text-input-success flex-shrink-0 mt-0.5" />
          <span className="font-medium">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Form Metadata */}
        <div className="bg-white p-8 rounded-xl shadow-md mb-6 border-2 border-input-border">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Form Details</h2>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Form Title <span className="text-input-error">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-input focus:outline-none focus:ring-2 focus:ring-input-focus focus:border-transparent transition-all duration-200"
                placeholder="e.g., Safety Inspection Form"
                required
              />
              {formTitle && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Check className="h-5 w-5 text-input-success" />
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <div className="relative">
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full px-4 py-3 bg-input-bg border border-input-border rounded-input focus:outline-none focus:ring-2 focus:ring-input-focus focus:border-transparent transition-all duration-200 min-h-[100px] resize-y"
                placeholder="Brief description of the form..."
                rows={3}
              />
              {formDescription && (
                <div className="absolute top-3 right-3 pointer-events-none">
                  <Check className="h-5 w-5 text-input-success" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fields Section */}
        <div className="bg-white p-8 rounded-xl shadow-md mb-6 border-2 border-input-border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Form Fields</h2>
            <button
              type="button"
              onClick={addField}
              className="px-5 py-2.5 bg-input-focus text-white rounded-input hover:bg-blue-700 transition-all duration-200 font-semibold shadow-sm hover:shadow flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Field
            </button>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-12 bg-input-bg rounded-input border-2 border-dashed border-input-border">
              <FileQuestion className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 font-medium mb-2">No fields added yet</p>
              <p className="text-gray-400 text-sm mb-4">Click "Add Field" to get started building your form</p>
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
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-3 border-2 border-input-border text-gray-700 rounded-input hover:bg-gray-50 transition-all duration-200 font-semibold flex items-center gap-2 shadow-sm"
          >
            <X className="h-5 w-5" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-input-success text-white rounded-input hover:bg-green-700 transition-all duration-200 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow"
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
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

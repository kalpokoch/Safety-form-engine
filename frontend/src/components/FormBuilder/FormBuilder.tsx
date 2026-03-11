import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Form Builder</h1>

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

      <form onSubmit={handleSubmit}>
        {/* Form Metadata */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Form Details</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Form Title *
            </label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Safety Inspection Form"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the form..."
              rows={3}
            />
          </div>
        </div>

        {/* Fields Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Form Fields</h2>
            <button
              type="button"
              onClick={addField}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
            >
              + Add Field
            </button>
          </div>

          {fields.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No fields added yet. Click "Add Field" to get started.
            </p>
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
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Form'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormBuilder;

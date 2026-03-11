import { useState } from 'react';
import { FieldDefinition, FieldType, LogicRule } from '../../types';

interface FieldEditorProps {
  field: FieldDefinition;
  onUpdate: (field: FieldDefinition) => void;
  onDelete: () => void;
  allFields: FieldDefinition[];
}

const FieldEditor = ({ field, onUpdate, onDelete, allFields }: FieldEditorProps) => {
  const [showLogicRules, setShowLogicRules] = useState(false);

  // Get current field index and only allow referencing previous fields
  const currentFieldIndex = allFields.findIndex(f => f.id === field.id);
  const previousFields = allFields.slice(0, currentFieldIndex);

  const handleFieldChange = (key: keyof FieldDefinition, value: any) => {
    onUpdate({ ...field, [key]: value });
  };

  const handleOptionsChange = (value: string) => {
    const options = value.split(',').map((opt) => opt.trim()).filter(Boolean);
    onUpdate({ ...field, options });
  };

  const addLogicRule = () => {
    const newRule: LogicRule = {
      when: '',
      operator: 'eq',
      value: '',
      action: 'show',
    };
    onUpdate({
      ...field,
      logicRules: [...(field.logicRules || []), newRule],
    });
  };

  const updateLogicRule = (index: number, updatedRule: LogicRule) => {
    const rules = [...(field.logicRules || [])];
    rules[index] = updatedRule;
    onUpdate({ ...field, logicRules: rules });
  };

  const deleteLogicRule = (index: number) => {
    const rules = [...(field.logicRules || [])];
    rules.splice(index, 1);
    onUpdate({ ...field, logicRules: rules });
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-4 bg-white shadow-sm">
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Field ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field ID
          </label>
          <input
            type="text"
            value={field.id}
            onChange={(e) => handleFieldChange('id', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., employee_name"
          />
        </div>

        {/* Field Label */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Label
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => handleFieldChange('label', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Employee Name"
          />
        </div>

        {/* Field Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={field.type}
            onChange={(e) => handleFieldChange('type', e.target.value as FieldType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="select">Select</option>
            <option value="radio_group">Radio Group</option>
            <option value="video_upload">Video Upload</option>
          </select>
        </div>

        {/* Required Checkbox */}
        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={field.required || false}
              onChange={(e) => handleFieldChange('required', e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Required</span>
          </label>
        </div>

        {/* Options (for select/radio) */}
        {(field.type === 'select' || field.type === 'radio_group') && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Options (comma-separated)
            </label>
            <input
              type="text"
              value={field.options?.join(', ') || ''}
              onChange={(e) => handleOptionsChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Option 1, Option 2, Option 3"
            />
          </div>
        )}

        {/* Data Source */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Source (optional)
          </label>
          <input
            type="text"
            value={field.dataSource || ''}
            onChange={(e) => handleFieldChange('dataSource', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., /metadata/branches"
          />
        </div>
      </div>

      {/* Logic Rules Section */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setShowLogicRules(!showLogicRules)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {showLogicRules ? '▼' : '▶'} Logic Rules ({field.logicRules?.length || 0})
        </button>

        {showLogicRules && (
          <div className="mt-3 space-y-3">
            {previousFields.length === 0 && (
              <div className="text-sm text-gray-500 italic p-3 bg-gray-50 rounded">
                Logic rules can only reference fields that appear before this field in the form.
                Add fields above this one to enable logic rules.
              </div>
            )}
            
            {field.logicRules?.map((rule, index) => (
              <div key={index} className="border border-gray-200 rounded p-3 bg-gray-50">
                <div className="grid grid-cols-5 gap-2 mb-2">
                  <select
                    value={rule.when}
                    onChange={(e) => updateLogicRule(index, { ...rule, when: e.target.value })}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="">When field...</option>
                    {previousFields.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={rule.operator}
                    onChange={(e) => updateLogicRule(index, { ...rule, operator: e.target.value as any })}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="eq">equals</option>
                    <option value="neq">not equals</option>
                    <option value="gt">greater than</option>
                    <option value="gte">greater or equal</option>
                    <option value="lt">less than</option>
                    <option value="lte">less or equal</option>
                  </select>

                  <input
                    type="text"
                    value={rule.value}
                    onChange={(e) => updateLogicRule(index, { ...rule, value: e.target.value })}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="value"
                  />

                  <select
                    value={rule.action}
                    onChange={(e) => updateLogicRule(index, { ...rule, action: e.target.value as any })}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                    <option value="require">Require</option>
                    <option value="highlight">Highlight</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => deleteLogicRule(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>

                {rule.action === 'highlight' && (
                  <input
                    type="color"
                    value={rule.color || '#ffff00'}
                    onChange={(e) => updateLogicRule(index, { ...rule, color: e.target.value })}
                    className="w-20 h-8 border border-gray-300 rounded"
                  />
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addLogicRule}
              disabled={previousFields.length === 0}
              className={`text-sm font-medium ${
                previousFields.length === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-green-600 hover:text-green-800'
              }`}
              title={
                previousFields.length === 0
                  ? 'Add fields above this one to enable logic rules'
                  : 'Add a new logic rule'
              }
            >
              + Add Logic Rule
            </button>
          </div>
        )}
      </div>

      {/* Delete Field Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onDelete}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm"
        >
          Delete Field
        </button>
      </div>
    </div>
  );
};

export default FieldEditor;

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
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

  const inputClass = "w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-input-focus focus:border-transparent transition-all duration-200 text-dark-text-primary placeholder-dark-text-muted text-sm";
  const labelClass = "block text-xs font-semibold text-dark-text-primary mb-1.5";

  return (
    <div className="border border-dark-border rounded-lg p-4 mb-4 bg-dark-card shadow-lg">
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Field ID */}
        <div>
          <label className={labelClass}>
            Field ID
          </label>
          <input
            type="text"
            value={field.id}
            onChange={(e) => handleFieldChange('id', e.target.value)}
            className={inputClass}
            placeholder="e.g., employee_name"
          />
        </div>

        {/* Field Label */}
        <div>
          <label className={labelClass}>
            Label
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => handleFieldChange('label', e.target.value)}
            className={inputClass}
            placeholder="e.g., Employee Name"
          />
        </div>

        {/* Field Type */}
        <div>
          <label className={labelClass}>
            Type
          </label>
          <select
            value={field.type}
            onChange={(e) => handleFieldChange('type', e.target.value as FieldType)}
            className={inputClass}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="textarea">Textarea</option>
            <option value="select">Select</option>
            <option value="radio_group">Radio Group</option>
            <option value="video_upload">Video Upload</option>
          </select>
        </div>

        {/* Required Checkbox */}
        <div className="flex items-center gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={field.required || false}
              onChange={(e) => handleFieldChange('required', e.target.checked)}
              className="mr-2 h-4 w-4 text-input-focus focus:ring-input-focus border-gray-300 rounded"
            />
            <span className="text-xs font-medium text-dark-text-primary">Required</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={field.disabled || false}
              onChange={(e) => handleFieldChange('disabled', e.target.checked)}
              className="mr-2 h-4 w-4 text-input-focus focus:ring-input-focus border-gray-300 rounded"
            />
            <span className="text-xs font-medium text-dark-text-primary">Disabled</span>
          </label>
        </div>

        {/* Options (for select/radio) */}
        {(field.type === 'select' || field.type === 'radio_group') && (
          <div className="col-span-2">
            <label className={labelClass}>
              Options (comma-separated)
            </label>
            <input
              type="text"
              value={field.options?.join(', ') || ''}
              onChange={(e) => handleOptionsChange(e.target.value)}
              className={inputClass}
              placeholder="e.g., Option 1, Option 2, Option 3"
            />
          </div>
        )}

        {/* Data Source */}
        <div className="col-span-2">
          <label className={labelClass}>
            Data Source (optional)
          </label>
          <input
            type="text"
            value={field.dataSource || ''}
            onChange={(e) => handleFieldChange('dataSource', e.target.value)}
            className={inputClass}
            placeholder="e.g., /metadata/branches"
          />
        </div>
      </div>

      {/* Logic Rules Section */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setShowLogicRules(!showLogicRules)}
          className="text-xs text-input-focus hover:text-indigo-400 font-semibold px-3 py-1.5 rounded-lg hover:bg-dark-hover transition-colors"
        >
          {showLogicRules ? '▼' : '▶'} Logic Rules ({field.logicRules?.length || 0})
        </button>

        {showLogicRules && (
          <div className="mt-3 space-y-3">
            {previousFields.length === 0 && (
              <div className="text-xs text-dark-text-secondary italic p-3 bg-dark-bg rounded-lg border border-dark-border">
                Logic rules can only reference fields that appear before this field in the form.
                Add fields above this one to enable logic rules.
              </div>
            )}
            
            {field.logicRules?.map((rule, index) => (
              <div key={index} className="border border-dark-border rounded-lg p-3 bg-dark-bg">
                <div className="grid grid-cols-5 gap-2 mb-2">
                  <select
                    value={rule.when}
                    onChange={(e) => updateLogicRule(index, { ...rule, when: e.target.value })}
                    className="px-2 py-1.5 border border-dark-border rounded-md text-xs bg-dark-card text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-input-focus"
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
                    className="px-2 py-1.5 border border-dark-border rounded-md text-xs bg-dark-card text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-input-focus"
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
                    className="px-2 py-1.5 border border-dark-border rounded-md text-xs bg-dark-card text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-input-focus"
                    placeholder="value"
                  />

                  <select
                    value={rule.action}
                    onChange={(e) => updateLogicRule(index, { ...rule, action: e.target.value as any })}
                    className="px-2 py-1.5 border border-dark-border rounded-md text-xs bg-dark-card text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-input-focus"
                  >
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                    <option value="require">Require</option>
                    <option value="highlight">Highlight</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => deleteLogicRule(index)}
                    className="px-2 py-1.5 bg-input-error text-white rounded-md text-xs hover:bg-red-600 transition-colors font-medium"
                  >
                    Delete
                  </button>
                </div>

                {rule.action === 'highlight' && (
                  <input
                    type="color"
                    value={rule.color || '#ffff00'}
                    onChange={(e) => updateLogicRule(index, { ...rule, color: e.target.value })}
                    className="w-20 h-8 border-2 border-dark-border rounded-md cursor-pointer bg-dark-bg"
                  />
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addLogicRule}
              disabled={previousFields.length === 0}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                previousFields.length === 0
                  ? 'text-dark-text-muted cursor-not-allowed bg-dark-bg'
                  : 'text-input-success hover:text-emerald-400 hover:bg-dark-hover'
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
          className="px-4 py-2 bg-input-error text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-2 font-medium shadow-sm hover:shadow text-sm"
        >
          <Trash2 className="h-4 w-4" />
          Delete Field
        </button>
      </div>
    </div>
  );
};

export default FieldEditor;

import { useState, useEffect } from 'react';
import { Check, AlertCircle, Lock } from 'lucide-react';
import { FieldDefinition } from '../../types';
import { evaluateLogicRules } from '../../utils/logicEngine';
import apiClient from '../../api/client';

interface FieldRendererProps {
  field: FieldDefinition;
  value: any;
  onChange: (value: any) => void;
  formData: Record<string, any>;
  error?: string;
}

const FieldRenderer = ({ field, value, onChange, formData, error }: FieldRendererProps) => {
  const [dynamicOptions, setDynamicOptions] = useState<any[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Evaluate logic rules
  const logicResult = evaluateLogicRules(field.logicRules, formData);

  // Handle hide logic
  if (logicResult.hide) {
    return null;
  }

  // Determine if field is required
  const isRequired = field.required || logicResult.require;

  // Load dynamic options from dataSource
  useEffect(() => {
    if (field.dataSource) {
      apiClient
        .get(field.dataSource)
        .then((response) => {
          setDynamicOptions(response.data);
        })
        .catch((err) => {
          console.error('Failed to load data source:', err);
        });
    }
  }, [field.dataSource]);

  // Handle video file change
  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setUploadingVideo(true);

    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);

      // Upload file to backend
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/upload/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Store the file path returned from backend
      onChange(response.data.path);
    } catch (err: any) {
      setUploadError(err.response?.data?.detail || 'Failed to upload video');
      setVideoPreview(null);
      onChange(null);
    } finally {
      setUploadingVideo(false);
    }
  };

  // Get options (either static or dynamic)
  const options = field.dataSource ? dynamicOptions : field.options || [];

  // Apply highlight styling
  const highlightStyle = logicResult.highlight
    ? { backgroundColor: logicResult.color || '#ffff00' }
    : {};

  // Determine disabled state
  const isDisabled = field.disabled || false;

  // Determine if field has valid value (for success state)
  const hasValue = value !== null && value !== undefined && value !== '';
  const showSuccess = hasValue && !error && !isDisabled;

  // Enhanced input styling
  const baseInputClass = `
    w-full px-4 py-3 
    bg-input-bg 
    border border-input-border 
    rounded-input 
    focus:outline-none focus:ring-2 focus:ring-input-focus focus:border-transparent
    transition-all duration-200
    disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
    ${error ? 'border-input-error focus:ring-input-error' : ''}
    ${showSuccess ? 'border-input-success' : ''}
    ${isDisabled ? 'bg-gray-100' : ''}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className="mb-6" style={highlightStyle}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {field.label}
        {isRequired && <span className="text-input-error ml-1">*</span>}
      </label>

      {/* Text Input */}
      {field.type === 'text' && (
        <div className="relative">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClass}
            required={isRequired}
            disabled={isDisabled}
            placeholder="Focus in"
          />
          {/* Icons */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {isDisabled && <Lock className="h-5 w-5 text-gray-400" />}
            {!isDisabled && showSuccess && <Check className="h-5 w-5 text-input-success" />}
            {!isDisabled && error && <AlertCircle className="h-5 w-5 text-input-error" />}
          </div>
        </div>
      )}

      {/* Number Input */}
      {field.type === 'number' && (
        <div className="relative">
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClass}
            required={isRequired}
            disabled={isDisabled}
            placeholder="0"
          />
          {/* Icons */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {isDisabled && <Lock className="h-5 w-5 text-gray-400" />}
            {!isDisabled && showSuccess && <Check className="h-5 w-5 text-input-success" />}
            {!isDisabled && error && <AlertCircle className="h-5 w-5 text-input-error" />}
          </div>
        </div>
      )}

      {/* Textarea */}
      {field.type === 'textarea' && (
        <div className="relative">
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`${baseInputClass} min-h-[120px] resize-y`}
            required={isRequired}
            disabled={isDisabled}
            placeholder="Enter text here..."
            rows={5}
          />
          {/* Icons */}
          <div className="absolute top-3 right-3 pointer-events-none">
            {isDisabled && <Lock className="h-5 w-5 text-gray-400" />}
            {!isDisabled && showSuccess && <Check className="h-5 w-5 text-input-success" />}
            {!isDisabled && error && <AlertCircle className="h-5 w-5 text-input-error" />}
          </div>
        </div>
      )}

      {/* Select Dropdown */}
      {field.type === 'select' && (
        <div className="relative">
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClass}
            required={isRequired}
            disabled={isDisabled}
          >
            <option value="">-- Select an option --</option>
            {options.map((opt: any, idx: number) => {
              // Handle both string arrays and object arrays (like branches)
              const optValue = typeof opt === 'string' ? opt : opt.id;
              const optLabel = typeof opt === 'string' ? opt : opt.name;
              return (
                <option key={idx} value={optValue}>
                  {optLabel}
                </option>
              );
            })}
          </select>
          {/* Icons */}
          <div className="absolute inset-y-0 right-8 flex items-center pr-3 pointer-events-none">
            {isDisabled && <Lock className="h-5 w-5 text-gray-400" />}
            {!isDisabled && showSuccess && <Check className="h-5 w-5 text-input-success" />}
            {!isDisabled && error && <AlertCircle className="h-5 w-5 text-input-error" />}
          </div>
        </div>
      )}

      {/* Radio Group */}
      {field.type === 'radio_group' && (
        <div className="space-y-3 bg-input-bg p-4 rounded-input border border-input-border">
          {options.map((opt: any, idx: number) => {
            const optValue = typeof opt === 'string' ? opt : opt.id;
            const optLabel = typeof opt === 'string' ? opt : opt.name;
            return (
              <label key={idx} className={`flex items-center cursor-pointer ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <input
                  type="radio"
                  name={field.id}
                  value={optValue}
                  checked={value === optValue}
                  onChange={(e) => onChange(e.target.value)}
                  className="mr-3 h-4 w-4 text-input-focus focus:ring-input-focus border-gray-300"
                  required={isRequired}
                  disabled={isDisabled}
                />
                <span className="text-gray-700 text-sm">{optLabel}</span>
              </label>
            );
          })}
          {isDisabled && (
            <div className="flex items-center text-gray-500 text-sm mt-2">
              <Lock className="h-4 w-4 mr-1" />
              <span>This field is locked</span>
            </div>
          )}
        </div>
      )}

      {/* Video Upload */}
      {field.type === 'video_upload' && (
        <div>
          <div className="relative">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className={baseInputClass}
              required={isRequired}
              disabled={uploadingVideo || isDisabled}
            />
            {/* Icons */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {isDisabled && <Lock className="h-5 w-5 text-gray-400" />}
              {!isDisabled && videoPreview && !uploadingVideo && <Check className="h-5 w-5 text-input-success" />}
            </div>
          </div>
          
          {uploadingVideo && (
            <div className="mt-2 text-sm text-input-focus flex items-center">
              <span className="inline-block animate-spin mr-2">⏳</span>
              Uploading video...
            </div>
          )}
          
          {uploadError && (
            <div className="mt-2 text-sm text-input-error flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {uploadError}
            </div>
          )}
          
          {videoPreview && !uploadingVideo && (
            <div className="mt-3">
              <video
                src={videoPreview}
                controls
                className="max-w-full h-64 border border-input-border rounded-input bg-input-bg"
              />
              <p className="mt-2 text-sm text-input-success flex items-center">
                <Check className="h-4 w-4 mr-1" />
                Video uploaded successfully
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 flex items-center text-sm text-input-error">
          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FieldRenderer;

import { useState, useEffect } from 'react';
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

  const baseInputClass =
    'w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';
  const errorClass = error ? 'border-red-500' : '';

  return (
    <div className="mb-4" style={highlightStyle}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Text Input */}
      {field.type === 'text' && (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseInputClass} ${errorClass}`}
          required={isRequired}
        />
      )}

      {/* Number Input */}
      {field.type === 'number' && (
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseInputClass} ${errorClass}`}
          required={isRequired}
        />
      )}

      {/* Select Dropdown */}
      {field.type === 'select' && (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseInputClass} ${errorClass}`}
          required={isRequired}
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
      )}

      {/* Radio Group */}
      {field.type === 'radio_group' && (
        <div className="space-y-2">
          {options.map((opt: any, idx: number) => {
            const optValue = typeof opt === 'string' ? opt : opt.id;
            const optLabel = typeof opt === 'string' ? opt : opt.name;
            return (
              <label key={idx} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name={field.id}
                  value={optValue}
                  checked={value === optValue}
                  onChange={(e) => onChange(e.target.value)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  required={isRequired}
                />
                <span className="text-gray-700">{optLabel}</span>
              </label>
            );
          })}
        </div>
      )}

      {/* Video Upload */}
      {field.type === 'video_upload' && (
        <div>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className={`${baseInputClass} ${errorClass}`}
            required={isRequired}
            disabled={uploadingVideo}
          />
          
          {uploadingVideo && (
            <div className="mt-2 text-sm text-blue-600">
              <span className="inline-block animate-spin mr-2">⏳</span>
              Uploading video...
            </div>
          )}
          
          {uploadError && (
            <div className="mt-2 text-sm text-red-600">
              {uploadError}
            </div>
          )}
          
          {videoPreview && !uploadingVideo && (
            <div className="mt-3">
              <video
                src={videoPreview}
                controls
                className="max-w-full h-64 border border-gray-300 rounded"
              />
              <p className="mt-1 text-sm text-green-600">✓ Video uploaded successfully</p>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FieldRenderer;

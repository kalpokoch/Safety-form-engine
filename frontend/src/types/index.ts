export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio_group' | 'video_upload';

export type LogicOperator = 'eq' | 'neq' | 'gte' | 'lte' | 'gt' | 'lt';
export type LogicAction = 'show' | 'hide' | 'require' | 'highlight';

export interface LogicRule {
  when: string;
  operator: LogicOperator;
  value: any;
  action: LogicAction;
  color?: string;
}

export interface FieldDefinition {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  disabled?: boolean;
  options?: string[];
  dataSource?: string;
  logicRules?: LogicRule[];
}

export interface FieldSchema {
  fields: FieldDefinition[];
}

export interface FormDefinition {
  id?: string;
  title: string;
  description?: string;
  field_schema: FieldSchema;
  version?: number;
  created_at?: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
}

export interface FormSubmission {
  form_id: string;
  branch_id: string;
  submission_data: Record<string, any>;
}

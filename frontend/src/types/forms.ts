export interface Branch {
  id: string;
  name: string;
  location: string;
}

export interface LogicRule {
  when: string;
  operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte";
  value: any;
  action: "show" | "hide" | "require" | "highlight";
  color?: string;
}

export interface FormField {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "radio_group" | "video_upload";
  required: boolean;
  options?: string[];
  dataSource?: string;
  logicRules?: LogicRule[];
}

export interface FieldSchema {
  fields: FormField[];
}

export interface FormDefinition {
  id: string;
  title: string;
  description: string;
  field_schema: FieldSchema;
  version: number;
  created_at: string;
}

export interface Submission {
  id: string;
  form_id: string;
  branch_id: string;
  branch_name?: string;
  submission_data: Record<string, any>;
  submitted_at: string;
}

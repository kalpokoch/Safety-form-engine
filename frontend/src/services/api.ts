import axios from "axios";
import type { Branch, FormDefinition } from "@/types/forms";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export const fetchBranches = () =>
  api.get<Branch[]>("/metadata/branches").then((r) => r.data);

export const fetchAllForms = () =>
  api.get<FormDefinition[]>("/forms/definitions").then((r) => r.data);

export const fetchFormDefinition = (formId: string) =>
  api.get<FormDefinition>(`/forms/definitions/${formId}`).then((r) => r.data);

export const createFormDefinition = (body: {
  title: string;
  description: string;
  field_schema: { fields: any[] };
}) => api.post<FormDefinition>("/forms/definitions", body).then((r) => r.data);

export const submitForm = (
  formId: string,
  body: { branch_id: string; submission_data: Record<string, any> }
) => api.post(`/forms/${formId}/submission`, body).then((r) => r.data);

export const uploadVideo = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post<{ filename: string; original_filename: string; path: string; size: number }>(
    "/upload/video",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  ).then((r) => r.data);
};

export default api;

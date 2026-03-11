import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFormDefinition, fetchBranches, submitForm, uploadVideo } from "@/services/api";
import FormRendererSkeleton from "@/components/FormRendererSkeleton";
import LoadingSpinner from "@/components/LoadingSpinner";
import { CheckCircle2, Copy, RefreshCw, ArrowRight, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { FormDefinition, Branch, FormField, LogicRule } from "@/types/forms";

const FormRenderer = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { data: formDef, isLoading: formLoading } = useQuery({
    queryKey: ['form', formId],
    queryFn: () => fetchFormDefinition(formId!),
    enabled: !!formId,
  });

  const { data: branches = [] } = useQuery({
    queryKey: ['branches'],
    queryFn: fetchBranches,
  });

  const loading = formLoading;

  const { control, handleSubmit, watch, formState: { errors }, setError, reset } = useForm<Record<string, any>>({
    defaultValues: { branch_id: "" },
  });

  const watchAll = watch();

  const submitMutation = useMutation({
    mutationFn: (data: { formId: string; body: any }) => 
      submitForm(data.formId, data.body),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      setSubmissionId(result?.id || crypto.randomUUID());
      setIsSubmitted(true);
    },
    onError: (err: any) => {
      setErrorMessage(err?.message || "Failed to submit form. Please try again.");
    },
  });

  const fieldStates = useMemo(() => {
    if (!formDef) return {};
    const states: Record<string, { visible: boolean; required: boolean; highlighted: boolean; color?: string }> = {};
    for (const field of formDef.field_schema.fields) {
      states[field.id] = { visible: true, required: field.required, highlighted: false };
      if (field.logicRules) {
        for (const rule of field.logicRules) {
          if (evaluateRule(rule, watchAll[rule.when])) {
            switch (rule.action) {
              case "show": states[field.id].visible = true; break;
              case "hide": states[field.id].visible = false; break;
              case "require": states[field.id].required = true; break;
              case "highlight": states[field.id].highlighted = true; states[field.id].color = rule.color || "#FFA500"; break;
            }
          }
        }
      }
    }
    return states;
  }, [formDef, watchAll]);

  const onSubmit = async (data: Record<string, any>) => {
    if (!formId || !formDef) return;
    if (!data.branch_id) { toast.error("Please select a branch"); return; }
    for (const field of formDef.field_schema.fields) {
      const state = fieldStates[field.id];
      if (state?.visible && state?.required && !data[field.id]) {
        setError(field.id, { message: `${field.label || "This field"} is required` });
        return;
      }
    }
    const { branch_id, ...submission_data } = data;
    setErrorMessage("");
    submitMutation.mutate({ formId: formId!, body: { branch_id, submission_data } });
  };

  const handleReset = () => {
    reset();
    setIsSubmitted(false);
    setSubmissionId("");
    setErrorMessage("");
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(submissionId);
    toast.success("Submission ID copied!");
  };

  if (loading) return <FormRendererSkeleton />;
  if (!formDef) return <div className="p-12 text-center text-muted-foreground">Form not found</div>;

  // Success Card View
  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="content-card p-8 md:p-12">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Success Icon */}
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>

            {/* Success Message */}
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Form Submitted Successfully!</h2>
              <p className="text-muted-foreground">Your safety inspection has been recorded.</p>
            </div>

            {/* Submission ID */}
            <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
              <span className="text-xs text-muted-foreground">Submission ID:</span>
              <code className="font-mono text-sm text-foreground">{submissionId.slice(0, 8)}...</code>
              <button
                onClick={handleCopyId}
                className="ml-2 p-1 hover:bg-background rounded transition-colors"
                title="Copy ID"
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-4">
              <button
                onClick={handleReset}
                className="btn-secondary flex items-center justify-center gap-2 py-3 px-6 min-h-[44px]"
              >
                <RefreshCw className="w-4 h-4" />
                Submit Another Response
              </button>
              <button
                onClick={() => navigate('/submissions')}
                className="btn-primary flex items-center justify-center gap-2 py-3 px-6 min-h-[44px]"
              >
                Go to Submissions
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form View
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-4 md:mb-6 flex items-center gap-3 p-3 md:p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {errorMessage}
        </div>
      )}

      <div className="content-card">
        <div className="p-4 md:p-6 border-b border-border">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">{formDef.title}</h1>
          {formDef.description && (
            <p className="text-muted-foreground text-sm mt-1">{formDef.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-6 space-y-4 md:space-y-5">
          {/* Branch selector */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Branch</label>
            <Controller
              name="branch_id"
              control={control}
              rules={{ required: "Branch is required" }}
              render={({ field }) => (
                <select {...field} className={`form-input ${errors.branch_id ? "form-input-error" : ""}`}>
                  <option value="">Select a branch...</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name} — {b.location}</option>
                  ))}
                </select>
              )}
            />
            {errors.branch_id && <p className="text-destructive text-xs mt-1">{errors.branch_id.message as string}</p>}
          </div>

          {/* Dynamic fields */}
          {formDef.field_schema.fields.map((field) => {
            const state = fieldStates[field.id];
            if (!state?.visible) return null;
            return (
              <div
                key={field.id}
                className="transition-all"
                style={state.highlighted ? { backgroundColor: state.color || "#FFA500", padding: "12px", borderRadius: "12px" } : {}}
              >
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {field.label}
                  {state.required && <span className="text-destructive ml-1">*</span>}
                </label>
                <FieldInput field={field} control={control} branches={branches} error={errors[field.id]} />
                {errors[field.id] && (
                  <p className="text-destructive text-xs mt-1">{errors[field.id]?.message as string}</p>
                )}
              </div>
            );
          })}

          <button
            type="submit"
            disabled={submitMutation.isPending}
            className="btn-primary w-full md:w-auto md:min-w-[200px] md:mx-auto md:block flex items-center justify-center gap-2 py-3 min-h-[44px]"
          >
            {submitMutation.isPending ? <LoadingSpinner className="!p-0 [&_svg]:w-5 [&_svg]:h-5" /> : "Submit Form"}
          </button>
        </form>
      </div>
    </div>
  );
};

function FieldInput({ field, control, branches, error }: { field: FormField; control: any; branches: Branch[]; error: any }) {
  const [uploading, setUploading] = useState(false);
  const errClass = error ? "form-input-error" : "";
  return (
    <Controller
      name={field.id}
      control={control}
      defaultValue=""
      render={({ field: f }) => {
        switch (field.type) {
          case "text":
            return <input type="text" {...f} className={`form-input ${errClass}`} placeholder={field.label} />;
          case "number":
            return <input type="number" {...f} onChange={(e) => f.onChange(e.target.valueAsNumber || "")} className={`form-input ${errClass}`} placeholder={field.label} />;
          case "select":
            if (field.dataSource) {
              return (
                <select {...f} className={`form-input ${errClass}`}>
                  <option value="">Select...</option>
                  {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              );
            }
            return (
              <select {...f} className={`form-input ${errClass}`}>
                <option value="">Select...</option>
                {(field.options || []).map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            );
          case "radio_group":
            return (
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4">
                {(field.options || []).map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm text-foreground cursor-pointer min-h-[44px] sm:min-h-0">
                    <input
                      type="radio"
                      name={field.id}
                      value={opt}
                      checked={f.value === opt}
                      onChange={() => f.onChange(opt)}
                      className="text-primary focus:ring-primary w-4 h-4"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            );
          case "video_upload":
            return (
              <div>
                <input
                  type="file"
                  accept="video/*"
                  disabled={uploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setUploading(true);
                      try {
                        const result = await uploadVideo(file);
                        f.onChange(result.path);
                        toast.success(`Video uploaded: ${result.original_filename}`);
                      } catch (error) {
                        toast.error("Failed to upload video");
                        console.error(error);
                      } finally {
                        setUploading(false);
                      }
                    }
                  }}
                  className={`form-input ${errClass}`}
                />
                {uploading && (
                  <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                    <LoadingSpinner className="!p-0 [&_svg]:w-4 [&_svg]:h-4" />
                    Uploading video...
                  </div>
                )}
                {f.value && typeof f.value === "string" && f.value.startsWith("/uploads/") && (
                  <video 
                    src={`${import.meta.env.VITE_API_URL || "http://localhost:8000"}${f.value}`} 
                    controls 
                    className="mt-2 rounded-lg max-h-48 w-full object-cover" 
                  />
                )}
              </div>
            );
          default:
            return <input type="text" {...f} className={`form-input ${errClass}`} />;
        }
      }}
    />
  );
}

function evaluateRule(rule: LogicRule, value: any): boolean {
  switch (rule.operator) {
    case "eq": return value == rule.value;
    case "neq": return value != rule.value;
    case "gt": return Number(value) > Number(rule.value);
    case "gte": return Number(value) >= Number(rule.value);
    case "lt": return Number(value) < Number(rule.value);
    case "lte": return Number(value) <= Number(rule.value);
    default: return false;
  }
}

export default FormRenderer;

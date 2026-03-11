import { useState } from "react";
import { Type, Hash, List, CircleDot, Video, X, GripVertical, Plus } from "lucide-react";
import { createFormDefinition } from "@/services/api";
import { toast } from "sonner";
import type { FormField } from "@/types/forms";
import LoadingSpinner from "@/components/LoadingSpinner";

const FIELD_TYPES = [
  { type: "text" as const, label: "Text", icon: Type },
  { type: "number" as const, label: "Number", icon: Hash },
  { type: "select" as const, label: "Select", icon: List },
  { type: "radio_group" as const, label: "Radio Group", icon: CircleDot },
  { type: "video_upload" as const, label: "Video Upload", icon: Video },
];

const typeBadgeColors: Record<string, string> = {
  text: "bg-blue-100 text-blue-700",
  number: "bg-purple-100 text-purple-700",
  select: "bg-green-100 text-green-700",
  radio_group: "bg-orange-100 text-orange-700",
  video_upload: "bg-red-100 text-red-700",
};

let fieldCounter = 0;

const FormBuilder = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"add" | "preview">("add");

  const addField = (type: FormField["type"]) => {
    fieldCounter++;
    const newField: FormField = {
      id: `field_${fieldCounter}_${Date.now()}`,
      label: "",
      type,
      required: false,
      ...(type === "select" || type === "radio_group" ? { options: [""] } : {}),
    };
    setFields([...fields, newField]);
    setMobileTab("preview"); // auto-switch to preview on mobile after adding
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], ...updates };
    setFields(updated);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!title.trim()) { toast.error("Please enter a form title"); return; }
    if (fields.length === 0) { toast.error("Please add at least one field"); return; }

    setSaving(true);
    try {
      const result = await createFormDefinition({ title, description, field_schema: { fields } });
      setSavedId(result.id);
      toast.success(`Form created! ID: ${result.id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to save form");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
      {/* Top bar */}
      <div className="content-card p-4 md:p-5 mb-4 md:mb-6">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Form Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input text-base md:text-lg font-semibold"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input flex-1"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary whitespace-nowrap flex items-center justify-center gap-2 w-full sm:w-auto min-h-[44px]"
            >
              {saving ? <LoadingSpinner className="!p-0 [&_svg]:w-4 [&_svg]:h-4" /> : "Save Form"}
            </button>
          </div>
        </div>
        {savedId && (
          <div className="mt-3 flex items-center gap-2 text-sm text-success flex-wrap">
            <span>Saved! ID: <code className="font-mono bg-muted px-2 py-0.5 rounded text-foreground text-xs break-all">{savedId}</code></span>
            <button
              onClick={() => { navigator.clipboard.writeText(savedId); toast.success("Copied!"); }}
              className="text-primary hover:underline text-xs"
            >
              Copy
            </button>
          </div>
        )}
      </div>

      {/* Mobile tab switcher */}
      <div className="lg:hidden flex mb-4 bg-muted rounded-lg p-1">
        <button
          onClick={() => setMobileTab("add")}
          className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
            mobileTab === "add" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          Add Fields
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
            mobileTab === "preview" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          Preview ({fields.length})
        </button>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Left panel: field palette */}
        <div className={`col-span-12 lg:col-span-3 ${mobileTab !== "add" ? "hidden lg:block" : ""}`}>
          <div className="content-card p-4">
            <h3 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">Field Types</h3>
            <div className="grid grid-cols-1 gap-2">
              {FIELD_TYPES.map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => addField(type)}
                  className="flex items-center gap-2 md:gap-3 p-3 rounded-lg border border-border hover:bg-muted hover:border-primary/30 transition-colors text-left min-h-[44px]"
                >
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs md:text-sm font-medium text-foreground truncate">{label}</div>
                    <div className="text-[10px] md:text-xs text-muted-foreground">{type}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel: live preview */}
        <div className={`col-span-12 lg:col-span-9 ${mobileTab !== "preview" ? "hidden lg:block" : ""}`}>
          <div className="content-card">
            <div className="p-4 md:p-5 border-b border-border">
              <h3 className="font-semibold text-foreground text-sm md:text-base">Form Preview</h3>
              <p className="text-xs md:text-sm text-muted-foreground">{fields.length} field(s) added</p>
            </div>

            {fields.length === 0 ? (
              <div className="p-8 md:p-12 text-center text-muted-foreground">
                <Plus className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Click a field type to add it to your form</p>
              </div>
            ) : (
              <div className="p-4 md:p-5 space-y-3 md:space-y-4">
                {fields.map((field, i) => (
                  <FieldCard
                    key={field.id}
                    field={field}
                    onUpdate={(updates) => updateField(i, updates)}
                    onRemove={() => removeField(i)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function FieldCard({
  field,
  onUpdate,
  onRemove,
}: {
  field: FormField;
  onUpdate: (u: Partial<FormField>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="border border-border rounded-xl p-3 md:p-4 bg-card">
      <div className="flex items-start gap-2 md:gap-3">
        <GripVertical className="w-5 h-5 text-muted-foreground mt-2 shrink-0 cursor-grab hidden sm:block" />
        <div className="flex-1 space-y-3 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Field label"
              value={field.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              className="form-input flex-1 min-w-0"
            />
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`status-pill ${typeBadgeColors[field.type]} text-[10px] md:text-xs`}>{field.type}</span>
              <label className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground whitespace-nowrap min-h-[44px] sm:min-h-0">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => onUpdate({ required: e.target.checked })}
                  className="rounded border-border w-4 h-4"
                />
                Required
              </label>
              <button onClick={onRemove} className="p-2 rounded hover:bg-destructive/10 text-destructive min-h-[44px] min-w-[44px] flex items-center justify-center sm:min-h-0 sm:min-w-0 sm:p-1.5">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {(field.type === "select" || field.type === "radio_group") && (
            <div className="space-y-2">
              {field.dataSource ? (
                <div className="text-xs md:text-sm text-muted-foreground bg-muted px-3 py-2 rounded-lg break-all">
                  Data source: <code className="font-mono text-primary">/metadata/branches</code>
                </div>
              ) : (
                <>
                  {(field.options || []).map((opt, oi) => (
                    <div key={oi} className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`Option ${oi + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const opts = [...(field.options || [])];
                          opts[oi] = e.target.value;
                          onUpdate({ options: opts });
                        }}
                        className="form-input flex-1 min-w-0"
                      />
                      <button
                        onClick={() => onUpdate({ options: (field.options || []).filter((_, j) => j !== oi) })}
                        className="p-2 text-muted-foreground hover:text-destructive min-h-[44px] min-w-[44px] flex items-center justify-center sm:min-h-0 sm:min-w-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => onUpdate({ options: [...(field.options || []), ""] })}
                    className="text-primary text-xs md:text-sm hover:underline min-h-[44px] sm:min-h-0 flex items-center"
                  >
                    + Add option
                  </button>
                </>
              )}

              {field.type === "select" && (
                <label className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground min-h-[44px] sm:min-h-0">
                  <input
                    type="checkbox"
                    checked={!!field.dataSource}
                    onChange={(e) =>
                      onUpdate(
                        e.target.checked
                          ? { dataSource: "/metadata/branches", options: undefined }
                          : { dataSource: undefined, options: [""] }
                      )
                    }
                    className="rounded border-border w-4 h-4"
                  />
                  Use branches as data source
                </label>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FormBuilder;

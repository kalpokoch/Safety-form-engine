import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, Send, GitBranch, Layers, Plus, Copy, ArrowRight, Search, Share2 } from "lucide-react";
import { toast } from "sonner";
import StatsCard from "@/components/StatsCard";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { fetchBranches, fetchAllForms } from "@/services/api";
import type { FormDefinition } from "@/types/forms";

const Dashboard = () => {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [savedForms, setSavedForms] = useState<FormDefinition[]>([]);

  const submissions = JSON.parse(localStorage.getItem("submissions") || "[]");

  const handleShare = (formId: string) => {
    const shareableLink = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        toast.success("Link copied to clipboard!", {
          description: "Share this link with others to fill the form"
        });
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };

  useEffect(() => {
    Promise.all([fetchBranches(), fetchAllForms()])
      .then(([branchesData, formsData]) => { 
        setBranches(branchesData); 
        setSavedForms(formsData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = savedForms.filter((f) =>
    f.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Safety Form Engine</h1>
          <p className="text-muted-foreground text-xs md:text-sm mt-1">Manage your safety forms and submissions</p>
        </div>
        <Link to="/builder" className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center min-h-[44px]">
          <Plus className="w-4 h-4" /> Create New Form
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <StatsCard icon={FileText} label="Total Forms Created" value={savedForms.length} />
        <StatsCard icon={Send} label="Total Submissions" value={submissions.length} />
        <StatsCard icon={GitBranch} label="Active Branches" value={branches.length} />
        <StatsCard icon={Layers} label="Field Types Supported" value={5} />
      </div>

      {/* Recent Forms */}
      <div className="content-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 md:p-5 border-b border-border">
          <h2 className="text-base md:text-lg font-semibold text-foreground">Recent Forms</h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search forms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-9 w-full"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 md:p-12 text-center text-muted-foreground">
            <FileText className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No forms yet. Create your first form!</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-left">
                    <th className="px-5 py-3 font-medium">Form ID</th>
                    <th className="px-5 py-3 font-medium">Title</th>
                    <th className="px-5 py-3 font-medium">Version</th>
                    <th className="px-5 py-3 font-medium">Created At</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((form) => (
                    <tr key={form.id} className="border-b border-border table-row-hover">
                      <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                        {form.id.slice(0, 8)}...
                      </td>
                      <td className="px-5 py-4 font-medium text-foreground">{form.title}</td>
                      <td className="px-5 py-4">
                        <span className="status-pill status-active">v{form.version}</span>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {new Date(form.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/form/${form.id}`}
                            className="flex items-center gap-1 text-primary hover:underline text-xs font-medium"
                          >
                            Fill <ArrowRight className="w-3 h-3" />
                          </Link>
                          <button
                            onClick={() => handleShare(form.id)}
                            className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-xs"
                          >
                            <Share2 className="w-3 h-3" /> Share
                          </button>
                          <button
                            onClick={() => navigator.clipboard.writeText(form.id)}
                            className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-xs"
                          >
                            <Copy className="w-3 h-3" /> Copy ID
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden divide-y divide-border">
              {filtered.map((form) => (
                <div key={form.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-foreground">{form.title}</span>
                    <span className="status-pill status-active text-[10px]">v{form.version}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(form.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <Link
                      to={`/form/${form.id}`}
                      className="btn-primary text-xs py-2 px-3 min-h-[44px] flex items-center gap-1"
                    >
                      Fill Form <ArrowRight className="w-3 h-3" />
                    </Link>
                    <button
                      onClick={() => handleShare(form.id)}
                      className="btn-secondary text-xs py-2 px-3 min-h-[44px] flex items-center gap-1"
                    >
                      <Share2 className="w-3 h-3" /> Share
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(form.id)}
                      className="btn-secondary text-xs py-2 px-3 min-h-[44px] flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copy ID
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

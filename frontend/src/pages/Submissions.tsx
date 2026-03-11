import { useState } from "react";
import { Search } from "lucide-react";
import type { Submission } from "@/types/forms";

const Submissions = () => {
  const [search, setSearch] = useState("");
  const submissions: Submission[] = JSON.parse(localStorage.getItem("submissions") || "[]");

  const filtered = submissions.filter(
    (s) =>
      s.form_id.toLowerCase().includes(search.toLowerCase()) ||
      (s.branch_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <h1 className="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6">Submissions</h1>

      <div className="content-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 md:p-5 border-b border-border">
          <h2 className="text-base md:text-lg font-semibold text-foreground">All Submissions</h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-9 w-full"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 md:p-12 text-center text-muted-foreground text-sm">No submissions yet.</div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-left">
                    <th className="px-5 py-3 font-medium">Submission ID</th>
                    <th className="px-5 py-3 font-medium">Form ID</th>
                    <th className="px-5 py-3 font-medium">Branch</th>
                    <th className="px-5 py-3 font-medium">Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id} className="border-b border-border table-row-hover">
                      <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{s.id.slice(0, 8)}...</td>
                      <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{s.form_id.slice(0, 8)}...</td>
                      <td className="px-5 py-4 text-foreground">{s.branch_name || s.branch_id.slice(0, 8)}</td>
                      <td className="px-5 py-4 text-muted-foreground">{new Date(s.submitted_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-border">
              {filtered.map((s) => (
                <div key={s.id} className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{s.branch_name || s.branch_id.slice(0, 8)}</span>
                    <span className="text-xs text-muted-foreground">{new Date(s.submitted_at).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Form: <span className="font-mono">{s.form_id.slice(0, 8)}</span>
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

export default Submissions;

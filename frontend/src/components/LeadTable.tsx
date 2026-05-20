import StatusBadge from "./StatusBadge";
import type { Lead } from "../types/lead";

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  deletingId: string | null;
  onEdit: (leadId: string) => void;
  onDelete: (leadId: string) => Promise<void>;
}

const LeadTable = ({
  leads,
  isLoading,
  deletingId,
  onEdit,
  onDelete,
}: LeadTableProps) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
        Loading leads...
      </div>
    );
  }

  if (!leads.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
        No leads match the current filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-5 py-4">Lead</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Source</th>
              <th className="px-5 py-4">Created</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {leads.map((lead) => (
              <tr key={lead._id} className="text-sm text-slate-700">
                <td className="px-5 py-4">
                  <div className="font-medium text-slate-900">{lead.name}</div>
                  <div className="mt-1 text-slate-500">{lead.email}</div>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-5 py-4 text-slate-600">{lead.source}</td>
                <td className="px-5 py-4 text-slate-600">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(lead._id)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(lead._id)}
                      disabled={deletingId === lead._id}
                      className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === lead._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;

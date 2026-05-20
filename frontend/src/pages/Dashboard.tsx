import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import LeadTable from "../components/LeadTable";
import Pagination from "../components/Pagination";
import type {
  Lead,
  LeadsResponse,
  LeadSource,
  LeadStatus,
} from "../types/lead";
import getApiErrorMessage from "../utils/apiError";

const Dashboard = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<LeadStatus | "">("");
  const [source, setSource] = useState<LeadSource | "">("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<{ data: LeadsResponse }>("/lead", {
        params: {
          page,
          limit,
          sort,
          ...(status ? { status } : {}),
          ...(source ? { source } : {}),
          ...(search.trim() ? { search: search.trim() } : {}),
        },
      });

      setLeads(response.data.data.leads);
      setTotal(response.data.data.pagination.total);
      setTotalPages(response.data.data.pagination.totalPages || 1);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to load leads."));
    } finally {
      setIsLoading(false);
    }
  }, [limit, page, search, sort, source, status]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchLeads();
  }, [fetchLeads]);

  const handleDelete = async (leadId: string) => {
    setDeletingId(leadId);

    try {
      await api.delete(`/lead/${leadId}`);
      if (leads.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        void fetchLeads();
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to delete lead."));
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get("/lead/export", { responseType: "blob" });
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "leads.csv";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to export leads."));
    }
  };

  const stats = {
    total,
    qualified: leads.filter((lead) => lead.status === "Qualified").length,
    contacted: leads.filter((lead) => lead.status === "Contacted").length,
    lost: leads.filter((lead) => lead.status === "Lost").length,
  };

  return (
    <>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total leads" value={String(stats.total)} />
        <StatCard label="Visible qualified" value={String(stats.qualified)} />
        <StatCard label="Visible contacted" value={String(stats.contacted)} />
        <StatCard label="Visible lost" value={String(stats.lost)} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Lead pipeline</h2>
            <p className="mt-1 text-sm text-slate-600">
              Search, filter, export, and manage lead records from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/leads/new")}
              className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Add lead
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="space-y-2 text-sm font-medium text-slate-700 xl:col-span-2">
            <span>Search</span>
            <input
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
              placeholder="Search by name or email"
            />
          </label>

          <SelectField
            label="Status"
            value={status}
            onChange={(value) => {
              setPage(1);
              setStatus(value as LeadStatus | "");
            }}
            options={["", "New", "Contacted", "Qualified", "Lost"]}
          />

          <SelectField
            label="Source"
            value={source}
            onChange={(value) => {
              setPage(1);
              setSource(value as LeadSource | "");
            }}
            options={["", "Website", "Instagram", "Referral"]}
          />

          <SelectField
            label="Sort"
            value={sort}
            onChange={(value) => setSort(value)}
            options={[
              { label: "Newest first", value: "-createdAt" },
              { label: "Oldest first", value: "createdAt" },
              { label: "Name A-Z", value: "name" },
              { label: "Name Z-A", value: "-name" },
            ]}
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Showing {leads.length} of {total} total leads
          </p>

          <label className="flex items-center gap-3 text-sm text-slate-600">
            <span>Rows per page</span>
            <select
              value={limit}
              onChange={(event) => {
                setPage(1);
                setLimit(Number(event.target.value));
              }}
              className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </label>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <LeadTable
        leads={leads}
        isLoading={isLoading}
        deletingId={deletingId}
        onEdit={(leadId) => navigate(`/leads/${leadId}/edit`)}
        onDelete={handleDelete}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
};

const StatCard = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  );
};

interface SelectFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: string[] | { label: string; value: string }[];
}

const SelectField = ({ label, value, onChange, options }: SelectFieldProps) => {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
      >
        {options.map((option) => {
          const item =
            typeof option === "string"
              ? {
                  label: option || `All ${label.toLowerCase()}`,
                  value: option,
                }
              : option;

          return (
            <option key={item.value || `all-${label}`} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
    </label>
  );
};

export default Dashboard;

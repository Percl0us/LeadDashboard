import { useState } from "react";
import type { LeadFormValues, LeadSource, LeadStatus } from "../types/lead";

const statuses: LeadStatus[] = ["New", "Contacted", "Qualified", "Lost"];
const sources: LeadSource[] = ["Website", "Instagram", "Referral"];

interface LeadFormProps {
  initialValues: LeadFormValues;
  heading: string;
  description: string;
  submitLabel: string;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (values: LeadFormValues) => Promise<void>;
}

const LeadForm = ({
  initialValues,
  heading,
  description,
  submitLabel,
  isSubmitting,
  error,
  onSubmit,
}: LeadFormProps) => {
  const [values, setValues] = useState<LeadFormValues>(initialValues);

  const updateField = <K extends keyof LeadFormValues>(
    key: K,
    value: LeadFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(values);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">{heading}</h1>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Lead name</span>
            <input
              required
              minLength={4}
              value={values.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
              placeholder="Acme Industries"
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Email</span>
            <input
              required
              type="email"
              value={values.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
              placeholder="lead@company.com"
            />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Status</span>
            <select
              value={values.status}
              onChange={(event) =>
                updateField("status", event.target.value as LeadStatus)
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Source</span>
            <select
              value={values.source}
              onChange={(event) =>
                updateField("source", event.target.value as LeadSource)
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
            >
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>
    </section>
  );
};

export default LeadForm;

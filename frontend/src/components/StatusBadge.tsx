import type { LeadStatus } from "../types/lead";

const toneMap: Record<LeadStatus, string> = {
  New: "bg-sky-50 text-sky-700 ring-sky-200",
  Contacted: "bg-amber-50 text-amber-700 ring-amber-200",
  Qualified: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Lost: "bg-rose-50 text-rose-700 ring-rose-200",
};

const StatusBadge = ({ status }: { status: LeadStatus }) => {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${toneMap[status]}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;

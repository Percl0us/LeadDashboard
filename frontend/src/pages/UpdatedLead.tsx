import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import LeadForm from "../components/LeadForm";
import type { Lead, LeadFormValues, LeadsResponse } from "../types/lead";
import getApiErrorMessage from "../utils/apiError";

const UpdatedLead = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLead = async () => {
      if (!id) {
        setError("Lead ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get<{ data: LeadsResponse }>("/lead", {
          params: { limit: 1000 },
        });
        const matchedLead =
          response.data.data.leads.find((item) => item._id === id) || null;

        if (!matchedLead) {
          setError("Lead not found.");
        } else {
          setLead(matchedLead);
        }
      } catch (err) {
        setError(getApiErrorMessage(err, "Unable to load lead."));
      } finally {
        setIsLoading(false);
      }
    };
    void loadLead();
  }, [id]);

  const handleSubmit = async (values: LeadFormValues) => {
    if (!id) {
      setError("Lead ID is missing.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.patch(`/lead/${id}`, values);
      navigate("/dashboard");
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to update lead."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
        Loading lead details...
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {error || "Lead not found."}
      </div>
    );
  }

  return (
    <LeadForm
      initialValues={{
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
      }}
      heading="Edit Lead"
      description="Update the lead details and move it through the pipeline."
      submitLabel="Save changes"
      isSubmitting={isSubmitting}
      error={error}
      onSubmit={handleSubmit}
    />
  );
};

export default UpdatedLead;

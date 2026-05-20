import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import LeadForm from "../components/LeadForm";
import type { LeadFormValues } from "../types/lead";
import getApiErrorMessage from "../utils/apiError";

const initialValues: LeadFormValues = {
  name: "",
  email: "",
  status: "New",
  source: "Website",
};

const CreateLead = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: LeadFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await api.post("/lead/create", values);
      navigate("/dashboard");
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to create lead."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LeadForm
      initialValues={initialValues}
      heading="Create Lead"
      description="Add a new lead to the pipeline with source and status details."
      submitLabel="Create lead"
      isSubmitting={isSubmitting}
      error={error}
      onSubmit={handleSubmit}
    />
  );
};

export default CreateLead;

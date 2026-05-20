export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";
export type LeadSource = "Website" | "Instagram" | "Referral";

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
}

export interface LeadFormValues {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

export interface LeadsResponse {
  leads: Lead[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

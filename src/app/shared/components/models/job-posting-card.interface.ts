export const JobTypes = ["FULL-TIME", "PART-TIME", "INTERNSHIP"] as const;
export type JobType = (typeof JobTypes)[number];

export type CardVariant = "company" | "talent" | "program";

export interface Salary {
  min: number;
  max: number;
  currency: string;
}

export interface ProgramDetails {
  technologies: string[];
  startDate: string;
  endDate: string;
  status: "Available" | "Closed" | "Closing soon";
}

export interface JobPostingData {
  id: string;
  title: string;
  companyName: string;
  location: string;
  jobType: JobType;
  salary?: Salary;
  programDetails?: ProgramDetails;
}

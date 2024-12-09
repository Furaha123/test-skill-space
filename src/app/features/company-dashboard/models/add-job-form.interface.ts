// shared/components/models/job-posting-card.interface.ts

export type JobType = "FULL-TIME" | "PART-TIME" | "INTERNSHIP";
export type WorkplaceType = "On-site" | "Remote" | "Hybrid";
export type MessageType = "success" | "error";

export interface JobSalary {
  min: number;
  max: number;
  currency: string;
}

export interface JobQualifications {
  degree: string;
  idealAnswer: string;
  experience: string;
  idealExperience: string;
  isQualificationRequired: boolean;
  mustHaveDegree: boolean;
  isExperienceRequired: boolean;
  mustHaveExperience: boolean;
}

export interface JobPostingData {
  id: string;
  title: string;
  companyName: string;
  location: string;
  jobType: JobType;
  salary: JobSalary;
  workplaceType: WorkplaceType;
  deadline: string;
  description: string;
  qualifications: JobQualifications;
  skills: string[];
}

export interface DropdownOption {
  value: string;
  viewValue: string;
}

export interface IJobForm {
  title: string;
  company: string;
  workplaceType: WorkplaceType;
  location: string;
  jobType: JobType;
  salaryRange: string;
  deadline: string;
  description: string;
  degree: string;
  idealAnswer: string;
  experience: string;
  idealExperience: string;
  isQualificationRequired: boolean;
  mustHaveDegree: boolean;
  isExperienceRequired: boolean;
  mustHaveExperience: boolean;
  skills?: string[];
}

export interface SuccessState {
  show: boolean;
  message: string;
  type: MessageType;
}

export interface EducationRecord {
  degree: string;
  institution: string;
  address?: string;
  country?: string;
  qualification?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  filesCount: number;
  files: { name: string; url: string }[];
}

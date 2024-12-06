export interface EducationRecord {
  id?: string;
  name: string;
  address: string;
  country: string;
  qualificationLevel: string;
  programName: string;
  programStatus: string;
  commencementDate: string;
  completionDate: string;
  academicTranscriptUrls?: string[];
}

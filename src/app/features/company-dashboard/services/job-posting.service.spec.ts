import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { JobPostingService } from "./job-posting.service";
import { environment } from "../../../../environments/environment";
import {
  JobPostingData,
  IJobForm,
  DropdownOption,
} from "../models/add-job-form.interface";

describe("JobPostingService", () => {
  let service: JobPostingService;
  let httpMock: HttpTestingController;
  const BASE_URL = environment.apiUrl;

  const mockJobs: JobPostingData[] = [
    {
      id: "1",
      title: "Software Engineer",
      companyName: "Tech Corp",
      location: "New York",
      jobType: "FULL-TIME",
      salary: {
        min: 50000,
        max: 80000,
        currency: "USD",
      },
      workplaceType: "Remote",
      deadline: "2024-12-31",
      description: "Test description",
      qualifications: {
        degree: "Bachelor",
        idealAnswer: "Computer Science",
        experience: "2 years",
        idealExperience: "4 years",
        isQualificationRequired: true,
        mustHaveDegree: true,
        isExperienceRequired: true,
        mustHaveExperience: false,
      },
      skills: ["JavaScript", "TypeScript"],
    },
  ];

  const mockJobForm: IJobForm = {
    title: "New Job",
    company: "Test Company",
    workplaceType: "Remote",
    location: "Remote",
    jobType: "FULL-TIME",
    salaryRange: "60000-80000",
    deadline: "2024-12-31",
    description: "Test Description",
    degree: "Bachelor",
    idealAnswer: "Computer Science",
    experience: "2 years",
    idealExperience: "4 years",
    isQualificationRequired: true,
    mustHaveDegree: true,
    isExperienceRequired: true,
    mustHaveExperience: false,
    skills: ["JavaScript", "React"],
  };

  const mockDropdownOptions: DropdownOption[] = [
    { value: "REMOTE", viewValue: "Remote" },
    { value: "ONSITE", viewValue: "On-site" },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JobPostingService],
    });

    service = TestBed.inject(JobPostingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("loadJobs", () => {
    it("should load jobs and update jobs subject", async () => {
      let jobs: JobPostingData[] | undefined;
      let loading: boolean | undefined;
      let error: string | null | undefined;

      service.jobs$.subscribe((j) => (jobs = j));
      service.loading$.subscribe((l) => (loading = l));
      service.error$.subscribe((e) => (error = e));

      service.loadJobs();

      const req = httpMock.expectOne(`${BASE_URL}/companys/company/job-posts`);
      expect(req.request.method).toBe("GET");
      req.flush(mockJobs);

      expect(jobs).toEqual(mockJobs);
      expect(loading).toBeFalsy();
      expect(error).toBeNull();
    });

    it("should handle network error", async () => {
      let error: string | null | undefined;
      let loading: boolean | undefined;

      service.error$.subscribe((e) => (error = e));
      service.loading$.subscribe((l) => (loading = l));

      service.loadJobs();

      const req = httpMock.expectOne(`${BASE_URL}/companys/company/job-posts`);
      req.error(new ErrorEvent("Network error"));

      expect(error).toBe("Error: ");
      expect(loading).toBeFalsy();
    });
  });

  describe("createJob", () => {
    it("should create job and update jobs list", async () => {
      const newJob: JobPostingData = {
        ...mockJobs[0],
        id: "2",
        title: mockJobForm.title,
      };
      let jobs: JobPostingData[] = [];

      service.jobs$.subscribe((j) => (jobs = j));

      service.createJob(mockJobForm).subscribe((response) => {
        expect(response).toEqual(newJob);
        expect(jobs).toContainEqual(newJob);
      });

      const req = httpMock.expectOne(`${BASE_URL}/companys/job-posts`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(mockJobForm);
      req.flush(newJob);
    });

    it("should handle error when creating job", async () => {
      service.createJob(mockJobForm).subscribe({
        error: (error) => {
          expect(error).toBe("Invalid request");
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/companys/job-posts`);
      req.error(new ErrorEvent("Invalid request"), { status: 400 });
    });
  });

  describe("deleteJob", () => {
    it("should delete job and update jobs list", async () => {
      service["jobsSubject"].next(mockJobs);
      let jobs: JobPostingData[] = [];

      service.jobs$.subscribe((j) => (jobs = j));

      service.deleteJob("1").subscribe(() => {
        expect(jobs.length).toBe(0);
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/companys/company/job-posts/1`,
      );
      expect(req.request.method).toBe("DELETE");
      req.flush(null);
    });

    it("should handle error when deleting job", async () => {
      service.deleteJob("1").subscribe({
        error: (error) => {
          expect(error).toBe("Resource not found.");
        },
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/companys/company/job-posts/1`,
      );
      req.error(new ErrorEvent("Not found"), { status: 404 });
    });
  });

  describe("getWorkplaceTypes", () => {
    it("should fetch workplace types", async () => {
      service.getWorkplaceTypes().subscribe((options) => {
        expect(options).toEqual(mockDropdownOptions);
      });

      const req = httpMock.expectOne(`${BASE_URL}/companys/workspace-types`);
      expect(req.request.method).toBe("GET");
      req.flush(mockDropdownOptions);
    });

    it("should handle error when fetching workplace types", async () => {
      service.getWorkplaceTypes().subscribe({
        error: (error) => {
          expect(error).toBe("Internal server error. Please try again later.");
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/companys/workspace-types`);
      req.error(new ErrorEvent("Server error"), { status: 500 });
    });
  });

  describe("getJobTypes", () => {
    it("should fetch job types", async () => {
      service.getJobTypes().subscribe((options) => {
        expect(options).toEqual(mockDropdownOptions);
      });

      const req = httpMock.expectOne(`${BASE_URL}/companys/job-types`);
      expect(req.request.method).toBe("GET");
      req.flush(mockDropdownOptions);
    });

    it("should handle error when fetching job types", async () => {
      service.getJobTypes().subscribe({
        error: (error) => {
          expect(error).toBe("Internal server error. Please try again later.");
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/companys/job-types`);
      req.error(new ErrorEvent("Server error"), { status: 500 });
    });
  });

  describe("Error Handling", () => {
    it("should handle different HTTP error statuses", () => {
      const testCases = [
        {
          status: 0,
          expected: "Error: ",
        },
        {
          status: 400,
          expected: "Invalid request",
        },
        {
          status: 404,
          expected: "Resource not found.",
        },
        {
          status: 500,
          expected: "Internal server error. Please try again later.",
        },
      ];

      testCases.forEach(({ status, expected }) => {
        service.loadJobs();
        const req = httpMock.expectOne(
          `${BASE_URL}/companys/company/job-posts`,
        );
        req.error(new ErrorEvent("Test error"), { status });

        service.error$.subscribe((error) => {
          expect(error).toBe(expected);
        });
      });
    });

    it("should handle client-side errors", () => {
      service.loadJobs();
      const req = httpMock.expectOne(`${BASE_URL}/companys/company/job-posts`);
      const clientError = new ErrorEvent("Client Error", {
        message: "Client-side error",
      });
      req.error(clientError);

      service.error$.subscribe((error) => {
        expect(error).toBe("Error: Client-side error");
      });
    });
  });
});

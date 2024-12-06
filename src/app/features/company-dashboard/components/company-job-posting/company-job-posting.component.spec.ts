import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CompanyJobPostingComponent } from "./company-job-posting.component";
import { JobPostingService } from "../../services/job-posting.service";
import { of } from "rxjs";
import { JobPostingData, IJobForm } from "../../models/add-job-form.interface";

// Create a custom Input event with the required Event properties
interface CustomInputEvent extends Event {
  target: EventTarget & { value: string };
}

describe("CompanyJobPostingComponent", () => {
  let component: CompanyJobPostingComponent;
  let fixture: ComponentFixture<CompanyJobPostingComponent>;
  let jobPostingService: jest.Mocked<JobPostingService>;

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
    {
      id: "2",
      title: "Product Manager",
      companyName: "Product Co",
      location: "Remote",
      jobType: "PART-TIME",
      salary: {
        min: 60000,
        max: 90000,
        currency: "USD",
      },
      workplaceType: "Hybrid",
      deadline: "2024-12-31",
      description: "Test description 2",
      qualifications: {
        degree: "Master",
        idealAnswer: "MBA",
        experience: "3 years",
        idealExperience: "5 years",
        isQualificationRequired: true,
        mustHaveDegree: false,
        isExperienceRequired: true,
        mustHaveExperience: true,
      },
      skills: ["Product Management", "Agile"],
    },
  ];

  const mockJobForm: IJobForm = {
    title: "New Job",
    company: "New Company",
    workplaceType: "Remote",
    location: "Chicago",
    jobType: "FULL-TIME",
    salaryRange: "60000-90000",
    deadline: "2024-12-31",
    description: "New job description",
    degree: "Bachelor",
    idealAnswer: "Computer Science",
    experience: "2 years",
    idealExperience: "4 years",
    isQualificationRequired: true,
    mustHaveDegree: true,
    isExperienceRequired: true,
    mustHaveExperience: false,
    skills: ["React", "Node.js"],
  };

  beforeEach(async () => {
    const jobServiceMock = {
      jobs$: of(mockJobs),
      loading$: of(false),
      error$: of(null),
      loadJobs: jest.fn(),
      deleteJob: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [CompanyJobPostingComponent],
      providers: [{ provide: JobPostingService, useValue: jobServiceMock }],
    }).compileComponents();

    jobPostingService = TestBed.inject(
      JobPostingService,
    ) as jest.Mocked<JobPostingService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyJobPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load jobs on init", () => {
    expect(jobPostingService.loadJobs).toHaveBeenCalled();
  });

  describe("Job Filtering", () => {
    it("should filter jobs by title", () => {
      const event = new Event("input") as CustomInputEvent;
      Object.defineProperty(event, "target", { value: { value: "software" } });
      component["onSearch"](event);
      expect(component["filteredJobs"].length).toBe(1);
      expect(component["filteredJobs"][0].title).toContain("Software");
    });

    it("should filter jobs by company name", () => {
      const event = new Event("input") as CustomInputEvent;
      Object.defineProperty(event, "target", { value: { value: "tech" } });
      component["onSearch"](event);
      expect(component["filteredJobs"].length).toBe(1);
      expect(component["filteredJobs"][0].companyName).toContain("Tech");
    });

    it("should filter jobs by location", () => {
      const event = new Event("input") as CustomInputEvent;
      Object.defineProperty(event, "target", { value: { value: "remote" } });
      component["onSearch"](event);
      expect(component["filteredJobs"].length).toBe(1);
      expect(component["filteredJobs"][0].location).toBe("Remote");
    });

    it("should show all jobs when search query is empty", () => {
      const event = new Event("input") as CustomInputEvent;
      Object.defineProperty(event, "target", { value: { value: "" } });
      component["onSearch"](event);
      expect(component["filteredJobs"].length).toBe(mockJobs.length);
    });
  });

  describe("Job Operations", () => {
    it("should handle delete job", () => {
      const jobId = "1";
      window.confirm = jest.fn(() => true);
      jobPostingService.deleteJob.mockReturnValue(of(undefined));

      component["onDeleteJob"](jobId);

      expect(jobPostingService.deleteJob).toHaveBeenCalledWith(jobId);
    });

    it("should not delete job if user cancels confirmation", () => {
      const jobId = "1";
      window.confirm = jest.fn(() => false);

      component["onDeleteJob"](jobId);

      expect(jobPostingService.deleteJob).not.toHaveBeenCalled();
    });

    it("should toggle add form visibility", () => {
      expect(component["showAddForm"]).toBeFalsy();

      component["onAddJob"]();
      expect(component["showAddForm"]).toBeTruthy();

      component["onCloseForm"]();
      expect(component["showAddForm"]).toBeFalsy();
    });
  });

  describe("Form Validation", () => {
    it("should validate job form with all required fields", () => {
      const result = component["validateJobForm"](mockJobForm);
      expect(result).toBeTruthy();
    });

    it("should fail validation when required fields are missing", () => {
      const invalidForm = { ...mockJobForm, title: "" };
      const result = component["validateJobForm"](invalidForm);
      expect(result).toBeFalsy();
    });
  });

  describe("Success Message Handling", () => {
    it("should show and hide success message", (done) => {
      component["showSuccessMessage"]("Test message");

      component["successMessage$"].subscribe((state) => {
        expect(state.show).toBeTruthy();
        expect(state.message).toBe("Test message");
        expect(state.type).toBe("success");
        done();
      });
    });

    it("should show error message", (done) => {
      component["showSuccessMessage"]("Error message", "error");

      component["successMessage$"].subscribe((state) => {
        expect(state.show).toBeTruthy();
        expect(state.message).toBe("Error message");
        expect(state.type).toBe("error");
        done();
      });
    });
  });

  it("should track jobs by id", () => {
    const job = mockJobs[0];
    expect(component["trackByJobId"](0, job)).toBe(job.id);
  });

  it("should return correct container class", () => {
    expect(component["containerClass"]).toBe("");
    component["showAddForm"] = true;
    expect(component["containerClass"]).toBe("show-form");
  });
});

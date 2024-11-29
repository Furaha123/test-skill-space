import { ComponentFixture, TestBed } from "@angular/core/testing";
import { JobPostingCardComponent } from "./job-posting-card.component";
import { By } from "@angular/platform-browser";
import {
  JobPostingData,
  JobType,
  JobTypes,
} from "../models/job-posting-card.interface";

describe("JobPostingCardComponent", () => {
  let component: JobPostingCardComponent;
  let fixture: ComponentFixture<JobPostingCardComponent>;

  const mockCompanyJobData: JobPostingData = {
    id: "1",
    title: "Software Engineer",
    companyName: "AmaliTech",
    location: "Kigali, Rwanda",
    jobType: "FULL-TIME",
    salary: {
      min: 20000,
      max: 25000,
      currency: "RWF",
    },
  };

  const mockProgramJobData: JobPostingData = {
    id: "2",
    title: "Software Engineering Program",
    companyName: "AmaliTech",
    location: "Kigali, Rwanda",
    jobType: "FULL-TIME",
    programDetails: {
      technologies: ["JavaScript", "React"],
      startDate: "Sep 16",
      endDate: "Sep 24,2024",
      status: "Available",
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobPostingCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobPostingCardComponent);
    component = fixture.componentInstance;
    component.jobPosting = mockCompanyJobData;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Company Variant", () => {
    beforeEach(() => {
      component.variant = "company";
      component.isEditable = true;
      fixture.detectChanges();
    });

    it("should display job title", () => {
      const titleElement = fixture.debugElement.query(By.css(".job-title"));
      expect(titleElement.nativeElement.textContent).toBe("Software Engineer");
    });

    it("should display company name and location", () => {
      const companyName = fixture.debugElement.query(By.css(".company-name"));
      const location = fixture.debugElement.query(By.css(".location"));

      expect(companyName.nativeElement.textContent).toBe("AmaliTech");
      expect(location.nativeElement.textContent).toContain("Kigali, Rwanda");
    });

    it("should display correct job type indicator", () => {
      const jobTypeElement = fixture.debugElement.query(By.css(".job-type"));
      expect(jobTypeElement.nativeElement.textContent.trim()).toBe("FULL-TIME");
    });

    it("should display salary information", () => {
      const salaryElement = fixture.debugElement.query(By.css(".salary"));
      expect(salaryElement.nativeElement.textContent).toContain(
        "Salary: RWF20000 - RWF25000",
      );
    });

    it("should toggle dropdown on menu button click", () => {
      const menuButton = fixture.debugElement.query(By.css(".menu-button"));
      menuButton.nativeElement.click();
      fixture.detectChanges();

      let dropdown = fixture.debugElement.query(By.css(".dropdown-menu"));
      expect(dropdown).toBeTruthy();

      menuButton.nativeElement.click();
      fixture.detectChanges();

      dropdown = fixture.debugElement.query(By.css(".dropdown-menu"));
      expect(dropdown).toBeFalsy();
    });

    it("should emit edit event when edit button is clicked", (done) => {
      const editSpy = jest.spyOn(component.editClicked, "emit");
      const menuButton = fixture.debugElement.query(By.css(".menu-button"));

      menuButton.nativeElement.click();
      fixture.detectChanges();

      setTimeout(() => {
        const editButton = fixture.debugElement.query(By.css(".dropdown-item"));
        editButton.nativeElement.click();
        fixture.detectChanges();

        expect(editSpy).toHaveBeenCalledWith("1");
        expect(component["showDropdown"]).toBeFalsy();
        done();
      });
    });

    it("should emit delete event when delete button is clicked", (done) => {
      const deleteSpy = jest.spyOn(component.deleteClicked, "emit");
      const menuButton = fixture.debugElement.query(By.css(".menu-button"));

      menuButton.nativeElement.click();
      fixture.detectChanges();

      setTimeout(() => {
        const deleteButton = fixture.debugElement.query(
          By.css(".dropdown-item.delete"),
        );
        deleteButton.nativeElement.click();
        fixture.detectChanges();

        expect(deleteSpy).toHaveBeenCalledWith("1");
        expect(component["showDropdown"]).toBeFalsy();
        done();
      });
    });

    it("should close dropdown when clicking outside", () => {
      component["showDropdown"] = true;
      fixture.detectChanges();

      const cardElement = fixture.debugElement.query(
        By.css(".job-posting-card"),
      );
      cardElement.nativeElement.click();
      fixture.detectChanges();

      expect(component["showDropdown"]).toBeFalsy();
    });
  });

  describe("Talent Variant", () => {
    beforeEach(() => {
      component.variant = "talent";
      fixture.detectChanges();
    });

    it("should emit apply event", () => {
      const applySpy = jest.spyOn(component.applyClicked, "emit");
      const applyButton = fixture.debugElement.query(By.css(".apply-button"));
      applyButton.nativeElement.click();

      expect(applySpy).toHaveBeenCalledWith("1");
    });

    it("should emit bookmark event", () => {
      const bookmarkSpy = jest.spyOn(component.bookmarkClicked, "emit");
      const bookmarkButton = fixture.debugElement.query(
        By.css(".bookmark-button"),
      );
      bookmarkButton.nativeElement.click();

      expect(bookmarkSpy).toHaveBeenCalledWith("1");
    });
  });

  describe("Program Variant", () => {
    beforeEach(() => {
      component.variant = "program";
      component.jobPosting = mockProgramJobData;
      fixture.detectChanges();
    });

    it("should display program details", () => {
      const programTitle = fixture.debugElement.query(By.css(".program-title"));
      const technologies = fixture.debugElement.queryAll(By.css(".tech-badge"));
      const status = fixture.debugElement.query(By.css(".status"));
      const dateRange = fixture.debugElement.query(By.css(".program-date"));

      expect(programTitle.nativeElement.textContent).toBe(
        "Software Engineering Program",
      );
      expect(technologies.length).toBe(2);
      expect(technologies[0].nativeElement.textContent.trim()).toBe(
        "JavaScript",
      );
      expect(technologies[1].nativeElement.textContent.trim()).toBe("React");
      expect(status.nativeElement.textContent.trim()).toBe("Available");
      expect(dateRange.nativeElement.textContent).toContain(
        "Sep 16 - Sep 24,2024",
      );
    });

    it("should handle program without optional details", () => {
      component.jobPosting = {
        ...mockProgramJobData,
        programDetails: undefined,
      };
      fixture.detectChanges();

      const technologies = fixture.debugElement.query(By.css(".technologies"));
      const status = fixture.debugElement.query(By.css(".status"));
      expect(technologies).toBeFalsy();
      expect(status).toBeFalsy();
    });
  });

  describe("Helper Methods", () => {
    it("should handle getJobTypeClass for all job types", () => {
      JobTypes.forEach((jobType: JobType) => {
        component.jobPosting = {
          ...mockCompanyJobData,
          jobType: jobType,
        };
        fixture.detectChanges();

        const jobTypeElement = fixture.debugElement.query(By.css(".job-type"));
        expect(
          jobTypeElement.classes[jobType.toLowerCase().replace("-", "")],
        ).toBeTruthy();
      });
    });

    it("should handle dropdown toggle events", () => {
      const event = new MouseEvent("click");
      jest.spyOn(event, "stopPropagation");

      component["toggleDropdown"](event);
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(component["showDropdown"]).toBeTruthy();

      component["toggleDropdown"](event);
      expect(component["showDropdown"]).toBeFalsy();
    });

    it("should handle program details checks", () => {
      // With complete program details
      component.jobPosting = mockProgramJobData;
      expect(component["hasProgramTechnologies"]()).toBeTruthy();
      expect(component["hasProgramDates"]()).toBeTruthy();

      // Without program details
      component.jobPosting = {
        ...mockProgramJobData,
        programDetails: undefined,
      };
      expect(component["hasProgramTechnologies"]()).toBeFalsy();
      expect(component["hasProgramDates"]()).toBeFalsy();

      // With empty program details
      component.jobPosting = {
        ...mockProgramJobData,
        programDetails: {
          technologies: [],
          startDate: "",
          endDate: "",
          status: "Available",
        },
      };
      expect(component["hasProgramTechnologies"]()).toBeFalsy();
      expect(component["hasProgramDates"]()).toBeFalsy();
    });

    it("should handle closeDropdown", () => {
      component["showDropdown"] = true;
      component["closeDropdown"]();
      expect(component["showDropdown"]).toBeFalsy();
    });
  });
});

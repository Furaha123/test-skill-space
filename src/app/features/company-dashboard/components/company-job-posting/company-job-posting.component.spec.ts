import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CompanyJobPostingComponent } from "./company-job-posting.component";
import { JobPostingCardComponent } from "../../../../shared/components/job-posting-card/job-posting-card.component";
import { By } from "@angular/platform-browser";

describe("CompanyJobPostingComponent", () => {
  let component: CompanyJobPostingComponent;
  let fixture: ComponentFixture<CompanyJobPostingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyJobPostingComponent, JobPostingCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyJobPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Initial State", () => {
    it("should initialize with 15 job postings", () => {
      expect(component.jobPostings.length).toBe(15);
    });

    it("should display correct job types", () => {
      const jobs = component.jobPostings;
      expect(jobs[1].jobType).toBe("PART-TIME");
      expect(jobs[2].jobType).toBe("INTERNSHIP");
      expect(jobs[0].jobType).toBe("FULL-TIME");
    });
  });

  describe("Search Functionality", () => {
    it("should update search query", () => {
      const input = fixture.debugElement.query(By.css("input"));
      const testValue = "engineer";

      input.nativeElement.value = testValue;
      input.triggerEventHandler("input", { target: { value: testValue } });
      fixture.detectChanges();

      const displayedCards = fixture.debugElement.queryAll(
        By.css("app-job-posting-card"),
      );
      expect(displayedCards.length).toBeGreaterThan(0);
    });

    it("should display no results message", () => {
      const input = fixture.debugElement.query(By.css("input"));
      input.triggerEventHandler("input", { target: { value: "nonexistent" } });
      fixture.detectChanges();

      const noResults = fixture.debugElement.query(By.css(".no-results"));
      expect(noResults).toBeTruthy();
    });
  });

  describe("Job Management", () => {
    it("should handle job addition", () => {
      const addButton = fixture.debugElement.query(By.css(".add-job-button"));
      const initialCount = component.jobPostings.length;

      addButton.triggerEventHandler("click", null);
      fixture.detectChanges();

      expect(component.jobPostings.length).toBe(initialCount + 1);
    });

    it("should handle card interactions", () => {
      const jobCard = fixture.debugElement.query(
        By.css("app-job-posting-card"),
      );

      // Test edit event
      jobCard.triggerEventHandler("editClicked", "1");
      fixture.detectChanges();

      // Test delete event
      jobCard.triggerEventHandler("deleteClicked", "1");
      fixture.detectChanges();

      expect(component.jobPostings.find((j) => j.id === "1")).toBeUndefined();
    });
  });

  describe("UI Elements", () => {
    it("should render all required buttons", () => {
      const filterBtn = fixture.debugElement.query(By.css(".filter-button"));
      const addBtn = fixture.debugElement.query(By.css(".add-job-button"));
      const searchBox = fixture.debugElement.query(By.css(".search-box"));

      expect(filterBtn).toBeTruthy();
      expect(addBtn).toBeTruthy();
      expect(searchBox).toBeTruthy();
    });
  });
});

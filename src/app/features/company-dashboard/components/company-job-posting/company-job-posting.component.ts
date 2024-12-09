import { Component, OnInit } from "@angular/core";
import { Subject, BehaviorSubject, timer } from "rxjs";
import { takeUntil, tap, take } from "rxjs/operators";
import {
  JobPostingData,
  IJobForm,
  SuccessState,
} from "../../models/add-job-form.interface";
import { JobPostingService } from "../../services/job-posting.service";

@Component({
  selector: "app-company-job-posting",
  templateUrl: "./company-job-posting.component.html",
  styleUrls: ["./company-job-posting.component.scss"],
})
export class CompanyJobPostingComponent implements OnInit {
  private readonly destroy$ = new Subject<void>();
  private readonly successState$ = new BehaviorSubject<SuccessState>({
    show: false,
    message: "",
    type: "success",
  });

  protected showAddForm = false;
  protected searchQuery = "";
  protected successMessage$ = this.successState$.asObservable();
  protected filteredJobs: JobPostingData[] = [];

  protected jobs$ = this.jobPostingService.jobs$;
  protected loading$ = this.jobPostingService.loading$;
  protected error$ = this.jobPostingService.error$;

  constructor(private jobPostingService: JobPostingService) {}

  ngOnInit(): void {
    this.loadJobs();
    this.subscribeToJobs();
  }

  private loadJobs(): void {
    this.jobPostingService.loadJobs();
  }

  private subscribeToJobs(): void {
    this.jobs$.pipe(takeUntil(this.destroy$)).subscribe((jobs) => {
      this.updateFilteredJobs(jobs);
    });
  }

  private updateFilteredJobs(jobs: JobPostingData[]): void {
    if (!this.searchQuery.trim()) {
      this.filteredJobs = jobs;
      return;
    }

    const searchTerm = this.searchQuery.toLowerCase().trim();
    this.filteredJobs = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm) ||
        job.companyName.toLowerCase().includes(searchTerm) ||
        job.location.toLowerCase().includes(searchTerm) ||
        job.jobType.toLowerCase().includes(searchTerm),
    );
  }

  protected trackByJobId(_: number, job: JobPostingData): string {
    return job.id;
  }

  protected onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.jobs$.pipe(take(1)).subscribe((jobs) => {
      this.updateFilteredJobs(jobs);
    });
  }

  protected onEditJob(jobId: string): void {
    const jobToEdit = this.filteredJobs.find((job) => job.id === jobId);
    if (jobToEdit) {
      this.showAddForm = true;
      // Handle edit logic
    }
  }

  protected onDeleteJob(jobId: string): void {
    if (confirm("Are you sure you want to delete this job posting?")) {
      this.jobPostingService
        .deleteJob(jobId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.showSuccessMessage("Job has been deleted successfully");
          },
          error: (error) => {
            this.showSuccessMessage(error, "error");
          },
        });
    }
  }

  protected onAddJob(): void {
    this.showAddForm = true;
  }

  protected onCloseForm(): void {
    this.showAddForm = false;
  }

  protected onSubmitJob(formData: IJobForm): void {
    if (!this.validateJobForm(formData)) {
      this.showSuccessMessage("Please fill in all required fields", "error");
      return;
    }

    // Add job functionality would go here
    this.showAddForm = false;
    this.showSuccessMessage("Your job has been published successfully");
  }

  private validateJobForm(formData: IJobForm): boolean {
    const requiredFields: (keyof IJobForm)[] = [
      "title",
      "company",
      "location",
      "jobType",
      "workplaceType",
      "deadline",
      "description",
      "degree",
      "experience",
      "salaryRange",
    ];

    return requiredFields.every((field) => {
      const value = formData[field];
      return value !== undefined && value !== null && value !== "";
    });
  }

  private showSuccessMessage(
    message: string,
    type: "success" | "error" = "success",
  ): void {
    this.successState$.next({ show: true, message, type });

    timer(3000)
      .pipe(
        takeUntil(this.destroy$),
        tap(() =>
          this.successState$.next({
            show: false,
            message: "",
            type: "success",
          }),
        ),
      )
      .subscribe();
  }

  protected get containerClass(): string {
    return this.showAddForm ? "show-form" : "";
  }
}

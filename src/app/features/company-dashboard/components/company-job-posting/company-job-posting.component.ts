import { Component } from "@angular/core";
import { JobPostingData } from "../../../../shared/components/models/job-posting-card.interface";

@Component({
  selector: "app-company-job-posting",
  templateUrl: "./company-job-posting.component.html",
  styleUrls: ["./company-job-posting.component.scss"],
})
export class CompanyJobPostingComponent {
  searchQuery = "";
  jobPostings: JobPostingData[] = Array(15)
    .fill(null)
    .map((_, index) => ({
      id: index.toString(),
      title: "Software Engineer",
      companyName: "AmaliTech",
      location: "Kigali, Rwanda",
      jobType:
        index === 1 ? "PART-TIME" : index === 2 ? "INTERNSHIP" : "FULL-TIME",
      salary: {
        min: 20000,
        max: 25000,
        currency: "RWF",
      },
    }));

  protected get filteredJobs(): JobPostingData[] {
    if (!this.searchQuery.trim()) {
      return this.jobPostings;
    }

    const searchTerm = this.searchQuery.toLowerCase().trim();
    return this.jobPostings.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm) ||
        job.companyName.toLowerCase().includes(searchTerm) ||
        job.location.toLowerCase().includes(searchTerm) ||
        job.jobType.toLowerCase().includes(searchTerm),
    );
  }

  protected onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
  }

  protected onEditJob(jobId: string): void {
    const jobIndex = this.jobPostings.findIndex((job) => job.id === jobId);
    if (jobIndex !== -1) {
      // Implement edit functionality
    }
  }

  protected onDeleteJob(jobId: string): void {
    this.jobPostings = this.jobPostings.filter((job) => job.id !== jobId);
  }

  protected onAddJob(): void {
    const newJob: JobPostingData = {
      id: (this.jobPostings.length + 1).toString(),
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

    this.jobPostings = [...this.jobPostings, newJob];
  }
}

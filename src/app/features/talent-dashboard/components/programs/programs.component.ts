import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { JobPostingData } from "../../../../shared/components/models/job-posting-card.interface";

@Component({
  selector: "app-programs",
  templateUrl: "./programs.component.html",
  styleUrls: ["./programs.component.scss"],
})
export class ProgramsComponent implements OnInit {
  programs: JobPostingData[] = [];
  selectedCompany = "All companies";
  searchQuery = "";
  statusFilter = "";

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.programs = [
      {
        id: "1",
        title: "Software Engineering Program",
        companyName: "Amalitech",
        location: "Kigali",
        jobType: "FULL-TIME",
        salary: {
          min: 200000,
          max: 5000000,
          currency: "Rwf",
        },
        programDetails: {
          technologies: ["React", "Nodejs"],
          startDate: "Jan 10, 2024",
          endDate: "June 20, 2024",
          status: "Closed",
        },
      },
      {
        id: "1",
        title: "Software Engineering Program",
        companyName: "Amalitech",
        location: "Kigali",
        jobType: "FULL-TIME",
        salary: {
          min: 200000,
          max: 5000000,
          currency: "Rwf",
        },
        programDetails: {
          technologies: ["React", "Nodejs"],
          startDate: "Jan 10, 2024",
          endDate: "June 20, 2024",
          status: "Available",
        },
      },
      {
        id: "1",
        title: "Software Engineering Program",
        companyName: "Amalitech",
        location: "Kigali",
        jobType: "FULL-TIME",
        salary: {
          min: 200000,
          max: 5000000,
          currency: "Rwf",
        },
        programDetails: {
          technologies: ["React", "Nodejs"],
          startDate: "Jan 10, 2024",
          endDate: "June 20, 2024",
          status: "Closing soon",
        },
      },
      {
        id: "1",
        title: "Software Engineering Program",
        companyName: "Amalitech",
        location: "Kigali",
        jobType: "FULL-TIME",
        salary: {
          min: 200000,
          max: 5000000,
          currency: "Rwf",
        },
        programDetails: {
          technologies: ["React", "Nodejs"],
          startDate: "Jan 10, 2024",
          endDate: "June 20, 2024",
          status: "Closed",
        },
      },
      {
        id: "1",
        title: "Software Engineering Program",
        companyName: "Amalitech",
        location: "Kigali",
        jobType: "FULL-TIME",
        salary: {
          min: 200000,
          max: 5000000,
          currency: "Rwf",
        },
        programDetails: {
          technologies: ["React", "Nodejs"],
          startDate: "Jan 10, 2024",
          endDate: "June 20, 2024",
          status: "Closed",
        },
      },
    ];
  }

  onApply(id: string) {
    this.router.navigate(["talent/program", id]);
  }
}

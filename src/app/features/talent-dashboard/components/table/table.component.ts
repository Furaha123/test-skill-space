import { Component } from "@angular/core";

interface Assessment {
  name: string;
  dateTaken: string;
  score: number;
  status: "Pass" | "Fail";
  badgeEarned: boolean;
  timeTaken: string;
  retakeOption: string;
}

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
})
export class TableComponent {
  assessments: Assessment[] = [
    {
      name: "Python Fundamentals",
      dateTaken: "2024-10-01",
      score: 85,
      status: "Pass",
      badgeEarned: true,
      timeTaken: "45 minutes",
      retakeOption: "No",
    },
    {
      name: "UI Design Basics",
      dateTaken: "2024-09-20",
      score: 68,
      status: "Fail",
      badgeEarned: false,
      timeTaken: "30 minutes",
      retakeOption: "Yes (Available in 3 days)",
    },
    {
      name: "JavaScript Essentials",
      dateTaken: "2024-10-05",
      score: 92,
      status: "Pass",
      badgeEarned: true,
      timeTaken: "50 minutes",
      retakeOption: "No",
    },
    {
      name: "Data Structures and Algorithms",
      dateTaken: "2024-10-10",
      score: 74,
      status: "Pass",
      badgeEarned: true,
      timeTaken: "1 hour",
      retakeOption: "No",
    },
    {
      name: "React.js Advanced Concepts",
      dateTaken: "2024-09-28",
      score: 65,
      status: "Fail",
      badgeEarned: false,
      timeTaken: "1 hour 15 minutes",
      retakeOption: "Yes (Available in 5 days)",
    },
    {
      name: "Agile Project Management",
      dateTaken: "2024-10-15",
      score: 80,
      status: "Pass",
      badgeEarned: true,
      timeTaken: "40 minutes",
      retakeOption: "No",
    },
    {
      name: "Cybersecurity Basics",
      dateTaken: "2024-09-30",
      score: 71,
      status: "Pass",
      badgeEarned: true,
      timeTaken: "35 minutes",
      retakeOption: "No",
    },
    {
      name: "HTML & CSS Mastery",
      dateTaken: "2024-10-20",
      score: 88,
      status: "Pass",
      badgeEarned: true,
      timeTaken: "1 hour",
      retakeOption: "No",
    },
  ];

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = Math.ceil(this.assessments.length / this.itemsPerPage);

  get paginatedAssessments() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.assessments.slice(startIndex, endIndex);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}

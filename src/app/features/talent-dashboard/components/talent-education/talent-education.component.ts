import { Component } from "@angular/core";

interface EducationRecord {
  degree: string;
  institution: string;
  filesCount: number;
}

@Component({
  selector: "app-talent-education",
  templateUrl: "./talent-education.component.html",
  styleUrls: ["./talent-education.component.scss"],
})
export class TalentEducationComponent {
  educationRecords: EducationRecord[] = [
    {
      degree: "BSc. Computer Science",
      institution: "University of Rwanda, Kigali",
      filesCount: 2,
    },
    {
      degree: "MSc. Information Technology",
      institution: "Carnegie Mellon University Africa, Kigali",
      filesCount: 3,
    },
    {
      degree: "BSc. Software Engineering",
      institution: "African Leadership University, Kigali",
      filesCount: 2,
    },
    {
      degree: "Certificate in Cybersecurity",
      institution: "Rwanda Coding Academy, Nyabihu",
      filesCount: 2,
    },
    {
      degree: "BSc. Information Systems",
      institution: "Mount Kenya University, Kigali Campus",
      filesCount: 3,
    },
  ];

  isUpdating = false; // Flag to toggle views
  selectedRecord: EducationRecord | null = null; // Holds the record being updated

  startUpdate(record: EducationRecord): void {
    this.isUpdating = true;
    this.selectedRecord = { ...record }; // Clone the record for editing
  }

  cancelUpdate(): void {
    this.isUpdating = false;
    this.selectedRecord = null;
  }

  saveUpdate(updatedRecord: EducationRecord): void {
    const index = this.educationRecords.findIndex(
      (record) => record.degree === updatedRecord.degree,
    );
    if (index !== -1) {
      this.educationRecords[index] = updatedRecord; // Update the record in the list
    }
    this.cancelUpdate(); // Exit update mode
  }
}

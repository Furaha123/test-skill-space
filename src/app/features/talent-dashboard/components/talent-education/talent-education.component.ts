import { Component, OnInit } from "@angular/core";
import { EducationRecord } from "../../models/education.record.interface";
import { TalentProfileService } from "../../services/talent-profile.service";

@Component({
  selector: "app-talent-education",
  templateUrl: "./talent-education.component.html",
  styleUrls: ["./talent-education.component.scss"],
})
export class TalentEducationComponent implements OnInit {
  educationRecords: EducationRecord[] = [];
  showUpdateComponent = false;
  selectedRecord: EducationRecord | null = null;
  mode: "add" | "update" = "add";
  isLoading = true;
  error: string | null = null;

  constructor(private readonly talentProfileService: TalentProfileService) {}

  ngOnInit(): void {
    this.fetchEducationRecords();
  }

  fetchEducationRecords(): void {
    this.talentProfileService.getSchools().subscribe({
      next: (response) => {
        this.educationRecords = response.data;
        this.isLoading = false;
      },
      error: () => {
        this.error = "Failed to load education records.";
        this.isLoading = false;
      },
    });
  }

  startAddNewRecord(): void {
    this.mode = "add";
    this.selectedRecord = {
      id: "",
      name: "",
      address: "",
      country: "",
      qualificationLevel: "",
      programName: "",
      programStatus: "",
      commencementDate: "",
      completionDate: "",
      academicTranscriptUrls: "",
    };
    this.showUpdateComponent = true;
  }

  startUpdate(record: EducationRecord): void {
    this.mode = "update";
    this.selectedRecord = { ...record };
    this.showUpdateComponent = true;
  }

  closeUpdateComponent(): void {
    this.showUpdateComponent = false;
    this.selectedRecord = null;
  }
}

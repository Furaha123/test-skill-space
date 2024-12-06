import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { EducationRecord } from "../../models/education.record.interface";

import {
  selectEducationError,
  selectEducationLoading,
  selectEducationRecords,
} from "../../store/talent.selector";
import { loadEducationRecords } from "../../store/talent.actions";
import { TalentProfileService } from "../../services/talent-profile.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-talent-education",
  templateUrl: "./talent-education.component.html",
  styleUrls: ["./talent-education.component.scss"],
})
export class TalentEducationComponent implements OnInit {
  educationRecords$: Observable<EducationRecord[]> = this.store.select(
    selectEducationRecords,
  );
  isLoading$: Observable<boolean> = this.store.select(selectEducationLoading);
  error$: Observable<string | null> = this.store.select(selectEducationError);

  showUpdateComponent = false;
  showDeleteDialog = false;
  selectedRecord: EducationRecord | null = null;
  recordToDelete: EducationRecord | null = null;
  mode: "add" | "update" = "add"; // Determines if the update component is in add or update mode

  constructor(
    private readonly store: Store,
    private readonly talentProfileService: TalentProfileService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadEducationRecords());
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
      academicTranscriptUrls: [],
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
  openDeleteDialog(record: EducationRecord): void {
    this.recordToDelete = record;
    this.showDeleteDialog = true;
  }

  closeDeleteDialog(): void {
    this.recordToDelete = null;
    this.showDeleteDialog = false;
  }

  confirmDelete(): void {
    if (this.recordToDelete?.id) {
      this.talentProfileService.deleteSchool(this.recordToDelete.id).subscribe({
        next: () => {
          this.toastr.success("Education record deleted successfully");
          this.store.dispatch(loadEducationRecords());
        },
        error: (error) => {
          this.toastr.error(
            error.message || "Failed to delete education record",
          );
        },
        complete: () => {
          this.closeDeleteDialog();
        },
      });
    }
  }
}

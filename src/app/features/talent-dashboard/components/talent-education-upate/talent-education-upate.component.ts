import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EducationRecord } from "../../models/education.record.interface";
import { TalentProfileService } from "../../services/talent-profile.service";
import { Store } from "@ngrx/store";
import {
  addEducationRecord,
  updateEducationRecord,
} from "../../store/talent.actions";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-talent-education-upate",
  templateUrl: "./talent-education-upate.component.html",
  styleUrls: ["./talent-education-upate.component.scss"],
})
export class TalentEducationUpateComponent implements OnInit {
  @Input() record: EducationRecord | null = null;
  @Input() mode: "add" | "update" = "add";
  @Output() closed = new EventEmitter<void>();

  educationForm: FormGroup;
  qualificationOptions = [
    "Bachelor's Degree",
    "Master's Degree",
    "Certificate",
  ];
  statusOptions = ["Graduated", "In Progress", "Certified"];

  constructor(
    private readonly fb: FormBuilder,
    private readonly talentProfileService: TalentProfileService,
    private readonly toastr: ToastrService,

    private readonly store: Store,
  ) {
    this.educationForm = this.fb.group({
      name: ["", Validators.required],
      address: [""],
      country: [""],
      qualificationLevel: [""],
      programName: ["", Validators.required],
      programStatus: [""],
      commencementDate: [""],
      completionDate: [""],
    });
  }

  ngOnInit() {
    if (this.record) {
      this.educationForm.patchValue(this.record);
    }
  }

  get isAddMode(): boolean {
    return this.mode === "add";
  }

  get isUpdateMode(): boolean {
    return this.mode === "update";
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.educationForm.get(fieldName);
    return Boolean(field?.invalid && field?.touched);
  }

  onBack(): void {
    this.closed.emit();
  }

  onCancel(): void {
    this.closed.emit();
  }

  navigateBackToList(): void {
    this.closed.emit();
  }

  parseTranscriptUrls(urls: string | null): string[] {
    if (!urls) {
      return [];
    }
    return urls
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean);
  }

  extractFileName(url: string): string {
    return url.split("/").pop() || "Unnamed File";
  }

  onDeleteFile(file: string): void {
    if (!this.record || !this.record.academicTranscriptUrls) {
      return;
    }

    const urls = this.record.academicTranscriptUrls;
    const updatedUrls = urls.filter((url) => url !== file);
    this.record.academicTranscriptUrls = updatedUrls;
  }

  onFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const newUrl = `https://example.com/${file.name}`;
      if (this.record) {
        const urls = this.record.academicTranscriptUrls || [];
        urls.push(newUrl);
        this.record.academicTranscriptUrls = urls;
      }
    }
  }
  onSubmit(): void {
    if (this.isAddMode) {
      this.createNewEducationRecord();
    } else if (this.isUpdateMode && this.record?.id) {
      this.updateExistingEducationRecord();
    }

    this.closed.emit();
  }

  private createNewEducationRecord(): void {
    const formValues = this.educationForm.value;
    const educationRecord: EducationRecord = {
      id: this.record?.id,
      name: formValues.name,
      address: formValues.address,
      country: formValues.country,
      qualificationLevel: formValues.qualificationLevel,
      programName: formValues.programName,
      programStatus: formValues.programStatus,
      commencementDate: formValues.commencementDate,
      completionDate: formValues.completionDate,
      academicTranscriptUrls: this.record?.academicTranscriptUrls || [],
    };

    this.store.dispatch(addEducationRecord({ educationRecord }));
  }

  private updateExistingEducationRecord(): void {
    if (!this.record?.id) {
      return;
    }

    const formValues = this.educationForm.value;
    const updatedRecord: EducationRecord = {
      ...this.record,
      ...{
        name: formValues.name,
        address: formValues.address,
        country: formValues.country,
        qualificationLevel: formValues.qualificationLevel,
        programName: formValues.programName,
        programStatus: formValues.programStatus,
        commencementDate: formValues.commencementDate,
        completionDate: formValues.completionDate,
      },
      academicTranscriptUrls: this.record.academicTranscriptUrls || [],
    };

    try {
      this.store.dispatch(
        updateEducationRecord({
          id: this.record.id,
          educationRecord: updatedRecord,
        }),
      );

      this.talentProfileService.updateLocalStorage(
        this.record.id,
        updatedRecord,
      );
      this.toastr.success("Education record updated successfully", "Success");
    } catch (error) {
      this.toastr.error(
        error instanceof Error
          ? error.message
          : "Failed to update education record",
        "Error",
      );
    }
  }
}

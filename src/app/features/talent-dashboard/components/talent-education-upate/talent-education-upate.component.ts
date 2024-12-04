/* eslint-disable no-console */
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EducationRecord } from "../../models/education.record.interface";
import { TalentProfileService } from "../../services/talent-profile.service";

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
  statusOptions = ["Graduated", "In Progress", "Completed"];

  constructor(
    private readonly fb: FormBuilder,
    private readonly talentProfileService: TalentProfileService,
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
    return urls.split(",").map((url) => url.trim());
  }

  extractFileName(url: string): string {
    return url.split("/").pop() || "Unnamed File";
  }

  onDeleteFile(file: string): void {
    if (!this.record || !this.record.academicTranscriptUrls) {
      return;
    }

    const urls = this.parseTranscriptUrls(this.record.academicTranscriptUrls);
    const updatedUrls = urls.filter((url) => url !== file);
    this.record.academicTranscriptUrls = updatedUrls.join(",");
  }

  onFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log("File uploaded:", file);

      const newUrl = `https://example.com/${file.name}`;
      if (this.record) {
        const urls = this.parseTranscriptUrls(
          this.record.academicTranscriptUrls,
        );
        urls.push(newUrl);
        this.record.academicTranscriptUrls = urls.join(",");
      }
    }
  }
  onSave(): void {
    if (this.educationForm.invalid) {
      console.log("Form is invalid. Please fill all required fields.");
      return;
    }

    const formData: EducationRecord = {
      ...this.educationForm.value,
      academicTranscriptUrls: this.record?.academicTranscriptUrls || "",
    };

    if (this.isAddMode) {
      // Add new school
      this.talentProfileService.createSchools(formData).subscribe({
        next: (response) => {
          console.log("School created successfully:", response);
          this.closed.emit();
        },
        error: (error) => {
          console.error("Error creating school:", error);
        },
      });
    } else if (this.isUpdateMode && this.record?.id) {
      this.talentProfileService
        .updateSchool(this.record.id, formData)
        .subscribe({
          next: (response) => {
            console.log("School updated successfully:", response);
            this.closed.emit();
          },
          error: (error) => {
            console.error("Error updating school:", error);
          },
        });
    }
  }
}

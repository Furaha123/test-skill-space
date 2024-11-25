import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EducationRecord } from "../../models/education.record.interface";

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

  constructor(private readonly fb: FormBuilder) {
    this.educationForm = this.fb.group({
      institution: ["", Validators.required],
      address: [""],
      country: [""],
      qualification: [""],
      degree: ["", Validators.required],
      status: [""],
      startDate: [""],
      endDate: [""],
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
}

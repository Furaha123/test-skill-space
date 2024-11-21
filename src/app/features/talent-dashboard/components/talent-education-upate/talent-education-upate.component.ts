import { Component, Input, OnInit } from "@angular/core";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EducationRecord } from "../../models/education.record.interface";

@Component({
  selector: "app-talent-education-upate",
  templateUrl: "./talent-education-upate.component.html",
  styleUrls: ["./talent-education-upate.component.scss"],
})
export class TalentEducationUpateComponent implements OnInit {
  @Input() record!: EducationRecord;
  @Input() mode: "add" | "update" = "add";

  educationForm: FormGroup;
  qualificationOptions = [
    "Bachelor's Degree",
    "Master's Degree",
    "Certificate",
  ];
  statusOptions = ["Graduated", "In Progress", "Completed"];

  constructor(private fb: FormBuilder) {
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
  onSave() {}
}

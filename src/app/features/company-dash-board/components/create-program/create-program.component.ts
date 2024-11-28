import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-create-program",
  templateUrl: "./create-program.component.html",
  styleUrls: ["./create-program.component.scss"],
})
export class CreateProgramComponent {
  programForm: FormGroup;
  showError = true;

  constructor(private readonly fb: FormBuilder) {
    this.programForm = this.fb.group({
      programName: ["", Validators.required],
      programDescription: ["", Validators.required],
      programRequirements: ["", Validators.required],
      requiredBadges: ["", Validators.required],
      additionalBadges: [""],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
    });
  }

  onSubmit(): void {
    if (this.programForm.invalid) {
      this.showError = true;
      Object.keys(this.programForm.controls).forEach((key) => {
        const control = this.programForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }
  }
}

import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  passwordPattern,
  phoneNumberPattern,
} from "../../../core/utils/patterns";

@Component({
  selector: "app-talent-registration-form",
  templateUrl: "./talent-registration-form.component.html",
  styleUrls: ["./talent-registration-form.component.scss"],
})
export class TalentRegistrationFormComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      userName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phoneNumber: [
        "",
        [Validators.required, Validators.pattern(phoneNumberPattern)],
      ],
      password: [
        "",
        [Validators.required, Validators.pattern(passwordPattern)],
      ],
      passwordConfirm: [
        "",
        [Validators.required, Validators.pattern(passwordPattern)],
      ],
    });
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);

    if (controlName === "passwordConfirm") {
      const confirm = this.form.get("passwordConfirm");
      return !!(
        confirm?.value !== this.form.get("password")?.value &&
        (confirm?.touched || confirm?.dirty || this.submitted)
      );
    }

    return !!(
      control &&
      control.invalid &&
      (control.touched || control.dirty || this.submitted)
    );
  }

  onSubmit(): void {
    this.submitted = true;
  }
}

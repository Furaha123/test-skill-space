import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-verification-page",
  templateUrl: "./verification-page.component.html",
  styleUrl: "./verification-page.component.scss",
})
export class VerificationPageComponent implements OnInit {
  form!: FormGroup;
  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      field1: ["", Validators.required],
      field2: ["", Validators.required],
      field3: ["", Validators.required],
      field4: ["", Validators.required],
      field5: ["", Validators.required],
    });
  }
  onContinue() {
    this.currentScreen = "OTP_Screen";
  }
  currentScreen = "checkMailScreem";
}

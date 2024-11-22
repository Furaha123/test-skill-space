import { Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import {
  passwordPattern,
  phoneNumberPattern,
} from "../../../core/utils/patterns";

@Component({
  selector: "app-company-registration-form",
  templateUrl: "./company-registration-form.component.html",
  styleUrl: "./company-registration-form.component.scss",
})
export class CompanyRegistrationFormComponent implements OnDestroy {
  form: FormGroup;
  submitted = false;
  isLoading$: Observable<boolean> | null = null;
  @ViewChild("fileInput") fileInput!: ElementRef;
  subscription: Subscription | null = null;
  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      certificate: [null, Validators.required],
      website: [""],
      logo: [null],
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

  onAddCertificate(event: Event, fileType: "logo" | "certificate") {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.readFile(file, fileType);
    }
  }

  readFile(file: File, fileType: "logo" | "certificate"): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.form.patchValue({
        [fileType]: e.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitted = true;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

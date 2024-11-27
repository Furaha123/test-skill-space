import { Component, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import {
  passwordPattern,
  phoneNumberPattern,
} from "../../../core/utils/patterns";
import { Store } from "@ngrx/store";
import { AppState } from "../../../shared/models/app.state.interface";
import * as AuthActions from "../../auth-store/auth.actions";
import * as AuthSelectors from "../../auth-store/auth.selectors";
import { Company } from "../../../shared/models/company.interface";

@Component({
  selector: "app-company-registration-form",
  templateUrl: "./company-registration-form.component.html",
  styleUrl: "./company-registration-form.component.scss",
})
export class CompanyRegistrationFormComponent implements OnDestroy {
  form: FormGroup;
  submitted = false;
  isLoading$: Observable<boolean> | null = this.store.select(
    AuthSelectors.selectIsLoading,
  );
  error$: Observable<string | null> = this.store.select(
    AuthSelectors.selectError,
  );
  subscription: Subscription | null = null;
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024;
  logoSizeExceed = false;
  certificateSizeExceeded = false;
  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store<AppState>,
  ) {
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
        [Validators.pattern(passwordPattern), Validators.required],
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

  onFileChange(event: Event, fileType: "logo" | "certificate"): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const isLogo = fileType === "logo";
    const isSizeExceeded = file.size > this.MAX_FILE_SIZE;

    // Handle size exceedance
    if (isSizeExceeded) {
      if (isLogo) {
        this.logoSizeExceed = true;
      } else {
        this.certificateSizeExceeded = true;
      }
      return;
    }
    if (isLogo) {
      this.logoSizeExceed = false;
    } else {
      this.certificateSizeExceeded = false;
    }
    this.form.patchValue({
      [fileType]: file,
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitted = true;
      const formValues = this.form.getRawValue();
      const company: Company = {
        email: formValues.email,
        password: formValues.password,
        name: formValues.name,
        websiteUrl: formValues.website,
        contactInformation: formValues.phoneNumber,
        logo: formValues.logo,
        certificates: formValues.certificate,
      };

      this.store.dispatch(AuthActions.registerCompany({ company }));
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

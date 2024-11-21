import { Component } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Subject } from "rxjs";

@Component({
  selector: "app-company-verification-page",
  templateUrl: "./company-verification-page.component.html",
  styleUrl: "./company-verification-page.component.scss",
})
export class CompanyVerificationPageComponent {
  private readonly destroy$ = new Subject<void>();
  private timer?: ReturnType<typeof setInterval>;

  verrificationError = false;
  isLoading = false;
  expiryTime = 600; // 10 minutes
  codeExpired = false;
  currentScreen: "checkMailScreen" | "successPage" | "OTP_Screen" =
    "checkMailScreen";
  userEmail = "";
  form!: FormGroup;

  verificationFailed = false;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      otp: this.fb.array(
        Array(6)
          .fill("")
          .map(() =>
            this.fb.control("", [
              Validators.required,
              Validators.pattern(/[0-9]/),
            ]),
          ),
      ),
    });
  }

  onContinue(): void {
    this.currentScreen = "OTP_Screen";
  }

  onOtpInput(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const nextInput = input.nextElementSibling as HTMLInputElement;
    const prevInput = input.previousElementSibling as HTMLInputElement;

    if (input.value.length > 0 && nextInput && event.key !== "Backspace") {
      nextInput.focus();
    } else if (event.key === "Backspace" && prevInput) {
      prevInput.focus();
    }
  }

  get otpControls(): FormArray<FormControl> {
    return this.form.get("otp") as FormArray<FormControl>;
  }
}

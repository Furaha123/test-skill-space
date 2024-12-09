// talent-settings.component.ts
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

interface ContactDetail {
  type: "phone" | "email";
  value: string;
  isVerified: boolean;
}

interface PasswordChange {
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
}

@Component({
  selector: "app-talent-settings",
  templateUrl: "./talent-settings.component.html",
  styleUrls: ["./talent-settings.component.scss"],
})
export class TalentSettingsComponent implements OnInit {
  public isTwoFactorEnabled = false;
  public contactDetails: ContactDetail[] = [
    { type: "phone", value: "+233244700700", isVerified: true },
    { type: "email", value: "demo@example.com", isVerified: false },
  ];
  public passwordForm: FormGroup;
  public emailForm: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.passwordForm = this.fb.group(
      {
        oldPassword: ["", [Validators.required]],
        newPassword: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
            ),
          ],
        ],
        repeatPassword: ["", [Validators.required]],
      },
      {
        validator: this.passwordMatchValidator,
      },
    );

    this.emailForm = this.fb.group({
      email: ["demo@example.com", [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    // Initialize component data
  }

  public onToggle2FA(): void {
    this.isTwoFactorEnabled = !this.isTwoFactorEnabled;
    // Implement 2FA toggle logic
  }

  public onEditContact(type: "phone" | "email"): void {
    // Implement edit logic
  }

  public onVerifyContact(type: "phone" | "email"): void {
    // Implement verification logic
  }

  public onPasswordChange(): void {
    if (this.passwordForm.valid) {
      const passwordData: PasswordChange = this.passwordForm.value;
      // Implement password change logic
    }
  }

  public onEmailChange(): void {
    if (this.emailForm.valid) {
      const newEmail: string = this.emailForm.get("email")?.value;
      // Implement email change logic
    }
  }

  private passwordMatchValidator(g: FormGroup): { mismatch: boolean } | null {
    const newPassword = g.get("newPassword")?.value;
    const repeatPassword = g.get("repeatPassword")?.value;
    return newPassword === repeatPassword ? null : { mismatch: true };
  }
}

import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  passwordPattern,
  phoneNumberPattern,
} from "../../../core/utils/patterns";
import { Observable, Subscription } from "rxjs";
import * as UserActions from "../../auth-store/auth.actions";
import * as UserSelectors from "../../auth-store/auth.selectors";
import { Store } from "@ngrx/store";
import { Talent } from "../../../shared/models/talent.interface";
import { AppState } from "../../../shared/models/app.state.interface";

@Component({
  selector: "app-talent-registration-form",
  templateUrl: "./talent-registration-form.component.html",
  styleUrls: ["./talent-registration-form.component.scss"],
})
export class TalentRegistrationFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  submitted = false;
  isLoading$: Observable<boolean> = this.store.select(
    UserSelectors.selectIsLoading,
  );

  subscription: Subscription | null = null;
  constructor(
    private readonly fb: FormBuilder,

    private readonly store: Store<AppState>,
  ) {}

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
    if (this.form.valid) {
      const { email, userName, password, phoneNumber } =
        this.form.getRawValue();

      const user: Talent = {
        email,
        password,
        phoneNumber,
        firstName: userName,
        lastName: "",
      };

      this.submitted = true;
      this.store.dispatch(UserActions.registerUser({ user }));
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

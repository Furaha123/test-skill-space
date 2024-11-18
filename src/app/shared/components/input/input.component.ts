import { Component, forwardRef, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "app-input",
  templateUrl: "./input.component.html",
  styleUrl: "./input.component.scss",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input({ required: true }) label = "";
  @Input() type:
    | "text"
    | "file"
    | "number"
    | "date"
    | "password"
    | "passwordConfirm"
    | "textarea"
    | "url"
    | "select"
    | "email" = "text";
  @Input({ required: true }) placeholder = "";
  @Input({ required: true }) id = "";
  @Input() icon = true;
  @Input() hasError = false;
  @Input() errorMessage: string[] = [];
  @Input() fieldType: "input" | "textarea" | "select" | "inputForOption" =
    "input";
  @Input() rows = 3;
  @Input() options: string[] = [];

  value = "";
  isPasswordVisible = false;

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.value = inputElement.value;
    this.onChange(this.value);
  }
}

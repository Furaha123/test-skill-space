import { ComponentFixture, TestBed } from "@angular/core/testing";
import { InputComponent } from "./input.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe("InputComponent", () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputComponent],
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // For app-error-toast
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;

    // Set required inputs to avoid warnings
    component.label = "Test Label";
    component.placeholder = "Test Placeholder";
    component.id = "test-id";

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // Test Input Properties
  describe("Input Properties", () => {
    it("should set input properties correctly", () => {
      const testProps = {
        label: "Email",
        placeholder: "Enter email",
        id: "email-input",
        type: "email",
        hasError: true,
        errorMessage: ["Invalid email"],
        icon: false,
      };

      Object.assign(component, testProps);
      fixture.detectChanges();

      expect(component.label).toBe(testProps.label);
      expect(component.placeholder).toBe(testProps.placeholder);
      expect(component.id).toBe(testProps.id);
      expect(component.type).toBe(testProps.type);
      expect(component.hasError).toBe(testProps.hasError);
      expect(component.errorMessage).toEqual(testProps.errorMessage);
      expect(component.icon).toBe(testProps.icon);
    });
  });

  // Test ControlValueAccessor Implementation
  describe("ControlValueAccessor Implementation", () => {
    it("should implement writeValue", () => {
      const testValue = "test value";
      component.writeValue(testValue);
      expect(component.value).toBe(testValue);
    });

    it("should implement registerOnChange", () => {
      const mockFn = jest.fn();
      component.registerOnChange(mockFn);
      expect(component.onChange).toBe(mockFn);
    });

    it("should implement registerOnTouched", () => {
      const mockFn = jest.fn();
      component.registerOnTouched(mockFn);
      expect(component.onTouched).toBe(mockFn);
    });

    it("should call onChange when input value changes", () => {
      const mockFn = jest.fn();
      component.registerOnChange(mockFn);

      const event = new Event("input");
      Object.defineProperty(event, "target", {
        value: { value: "new value" },
      });

      component.onInputChange(event);
      expect(mockFn).toHaveBeenCalledWith("new value");
    });
  });

  // Test Different Input Types
  describe("Input Types", () => {
    it("should render text input by default", () => {
      const compiled = fixture.nativeElement;
      const input = compiled.querySelector("input");
      expect(input.type).toBe("text");
    });

    it("should render password input with toggle visibility", () => {
      component.type = "password";
      fixture.detectChanges();

      expect(component.isPasswordVisible).toBeFalsy();
      component.togglePasswordVisibility();
      expect(component.isPasswordVisible).toBeTruthy();
    });

    it("should render textarea when type is textarea", () => {
      component.type = "textarea";
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const textarea = compiled.querySelector("textarea");
      expect(textarea).toBeTruthy();
      expect(textarea.rows).toBe(component.rows);
    });

    it("should render select with options", () => {
      component.type = "select";
      component.options = ["Option 1", "Option 2", "Option 3"];
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const select = compiled.querySelector("select");
      const options = select.querySelectorAll("option");

      expect(select).toBeTruthy();
      expect(options.length).toBe(component.options.length + 1); // +1 for placeholder
    });
  });

  // Test Error States
  describe("Error States", () => {
    it("should show error toast when hasError is true", () => {
      component.hasError = true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const errorToast = compiled.querySelector("app-error-toast");
      expect(errorToast).toBeTruthy();
    });

    it("should show correct error message for password type", () => {
      component.type = "password";
      component.hasError = true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const errorToast = compiled.querySelector("app-error-toast");
      expect(errorToast.getAttribute("title")).toBe("Password requirements");
    });
  });

  // Test File Input
  describe("File Input", () => {
    it("should render file input with custom label", () => {
      component.type = "file";
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const fileInput = compiled.querySelector('input[type="file"]');
      const fileLabel = compiled.querySelector(".file-input-label");

      expect(fileInput).toBeTruthy();
      expect(fileLabel.textContent.trim()).toBe("Choose File");
    });

    it("should handle file input change", () => {
      component.type = "file";
      const mockFn = jest.fn();
      component.registerOnChange(mockFn);

      const event = new Event("change");
      Object.defineProperty(event, "target", {
        value: { value: "test.pdf" },
      });

      component.onInputChange(event);
      expect(mockFn).toHaveBeenCalled();
    });
  });

  // Test CSS Classes
  describe("CSS Classes", () => {
    it("should add error class when hasError is true", () => {
      component.hasError = true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const input = compiled.querySelector(".input-field");
      expect(input.classList.contains("has-error")).toBeTruthy();
    });
  });

  // Test Input for Option
  describe("Input for Option", () => {
    it("should render input for option when fieldType is inputForOption", () => {
      component.fieldType = "inputForOption";
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const input = compiled.querySelector(".input-field");
      expect(input).toBeTruthy();
    });
  });
});

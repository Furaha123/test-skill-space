import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RegisterPageComponent } from "./register-page.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { provideMockStore } from "@ngrx/store/testing";
import { provideHttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

describe("RegisterPageComponent", () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;

  // Mock the Google API
  const mockGoogle = {
    accounts: {
      id: {
        initialize: jest.fn(),
        renderButton: jest.fn(),
        prompt: jest.fn(),
      },
    },
  };

  const initialState = {
    auth: {
      isLoading: false,
    },
  };

  beforeEach(async () => {
    // Add the mock to the window object
    Object.defineProperty(window, "google", {
      value: mockGoogle,
      writable: true,
    });

    await TestBed.configureTestingModule({
      declarations: [RegisterPageComponent],
      providers: [
        provideHttpClient(), // Updated from HttpClientTestingModule
        provideMockStore({ initialState }),
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Clean up after each test
    jest.clearAllMocks();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with 'talent' as the default form", () => {
    expect(component.currentForm).toBe("talent");
  });

  describe("Form switching functionality", () => {
    it("should switch to company registration form", () => {
      expect(component.currentForm).toBe("talent");
      component.onRegisterCompany();
      expect(component.currentForm).toBe("company");
    });

    it("should switch to talent registration form", () => {
      component.currentForm = "company";
      component.onRegisterTalent();
      expect(component.currentForm).toBe("talent");
    });

    it("should maintain state when switching between forms multiple times", () => {
      expect(component.currentForm).toBe("talent");
      component.onRegisterCompany();
      expect(component.currentForm).toBe("company");
      component.onRegisterTalent();
      expect(component.currentForm).toBe("talent");
      component.onRegisterCompany();
      expect(component.currentForm).toBe("company");
    });
  });

  describe("Template interactions", () => {
    it("should have the correct form type in the template", () => {
      expect(component.currentForm).toBe("talent");
      component.onRegisterCompany();
      fixture.detectChanges();
      expect(component.currentForm).toBe("company");
    });
  });

  describe("Google Sign-In", () => {
    it("should initialize Google Sign-In on init", () => {
      expect(mockGoogle.accounts.id.initialize).toHaveBeenCalled();
      expect(mockGoogle.accounts.id.renderButton).toHaveBeenCalled();
    });

    it("should prompt for Google Sign-In when registerWithGoogle is called", () => {
      component.registerWithGoogle();
      expect(mockGoogle.accounts.id.prompt).toHaveBeenCalled();
    });
  });
});

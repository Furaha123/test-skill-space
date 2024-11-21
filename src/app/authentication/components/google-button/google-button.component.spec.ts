import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GoogleButtonComponent } from "./google-button.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";

describe("GoogleButtonComponent", () => {
  let component: GoogleButtonComponent;
  let fixture: ComponentFixture<GoogleButtonComponent>;

  // Mock the Google API similar to register-page tests
  const mockGoogle = {
    accounts: {
      id: {
        initialize: jest.fn(),
        renderButton: jest.fn(),
        prompt: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    // Add the mock to the window object
    Object.defineProperty(window, "google", {
      value: mockGoogle,
      writable: true,
    });

    await TestBed.configureTestingModule({
      declarations: [GoogleButtonComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  describe("Input properties", () => {
    it("should have default button text", () => {
      expect(component.buttonText).toBe("Sign up with Google");
    });

    it("should accept custom button text", () => {
      const customText = "Custom Google Sign In";
      component.buttonText = customText;
      fixture.detectChanges();

      const buttonElement = fixture.nativeElement.querySelector(
        ".btn-google span.text",
      );
      expect(buttonElement.textContent).toBe(customText);
    });
  });

  describe("Google Sign-In initialization", () => {
    it("should initialize Google Sign-In on init", () => {
      expect(mockGoogle.accounts.id.initialize).toHaveBeenCalled();

      // Verify initialize was called with correct parameters
      expect(mockGoogle.accounts.id.initialize).toHaveBeenCalledWith(
        expect.objectContaining({
          callback: expect.any(Function),
        }),
      );
    });

    it("should render Google Sign-In button", () => {
      expect(mockGoogle.accounts.id.renderButton).toHaveBeenCalled();

      // Verify renderButton was called with correct parameters
      expect(mockGoogle.accounts.id.renderButton).toHaveBeenCalledWith(
        expect.any(Element),
        expect.objectContaining({
          theme: "outline",
          size: "large",
          width: "100%",
        }),
      );
    });
  });

  describe("Credential response handling", () => {
    it("should emit credential response when callback is triggered", () => {
      const mockResponse = { credential: "mock-credential" };
      const emitSpy = jest.spyOn(component.credentialResponse, "emit");

      // Get the callback function that was passed to initialize
      const initializeCall = mockGoogle.accounts.id.initialize.mock.calls[0][0];
      const callback = initializeCall.callback;

      // Trigger the callback
      callback(mockResponse);

      expect(emitSpy).toHaveBeenCalledWith(mockResponse);
    });
  });

  describe("Template structure", () => {
    it("should render button with correct structure", () => {
      const button = fixture.nativeElement.querySelector(".btn-google");
      const img = button.querySelector("img");
      const span = button.querySelector("span.text");

      expect(button).toBeTruthy();
      expect(img).toBeTruthy();
      expect(img.getAttribute("src")).toBe("assets/icon/icon-google.svg");
      expect(img.getAttribute("alt")).toBe("google icon");
      expect(span).toBeTruthy();
      expect(span.textContent).toBe("Sign up with Google");
    });
  });
});

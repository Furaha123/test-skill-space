import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { By } from "@angular/platform-browser";
import { LoaderComponent } from "./loader.component";
import { ThemePalette } from "@angular/material/core";

describe("LoaderComponent", () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoaderComponent],
      imports: [MatProgressSpinnerModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Initial state", () => {
    it("should have default values", () => {
      expect(component.isLoading).toBeFalsy();
      expect(component.diameter).toBe(100);
      expect(component.strokeWidth).toBe(10);
      expect(component.color).toBe("accent");
      expect(component.value).toBe(50);
    });

    it("should not display loader when isLoading is false", () => {
      const overlayElement = fixture.debugElement.query(By.css(".overlay"));
      expect(overlayElement).toBeNull();
    });
  });

  describe("Loading state", () => {
    beforeEach(() => {
      component.isLoading = true;
      fixture.detectChanges();
    });

    it("should display loader when isLoading is true", () => {
      const overlayElement = fixture.debugElement.query(By.css(".overlay"));
      expect(overlayElement).toBeTruthy();
    });

    it("should render mat-progress-spinner", () => {
      const spinnerElement = fixture.debugElement.query(
        By.css("mat-progress-spinner"),
      );
      expect(spinnerElement).toBeTruthy();
    });
  });

  describe("Input properties", () => {
    beforeEach(() => {
      component.isLoading = true;
      fixture.detectChanges();
    });

    it("should set correct diameter on mat-progress-spinner", () => {
      const testDiameter = 150;
      component.diameter = testDiameter;
      fixture.detectChanges();

      const spinnerElement = fixture.debugElement.query(
        By.css("mat-progress-spinner"),
      );
      expect(spinnerElement.componentInstance.diameter).toBe(testDiameter);
    });

    it("should set correct strokeWidth on mat-progress-spinner", () => {
      const testStrokeWidth = 15;
      component.strokeWidth = testStrokeWidth;
      fixture.detectChanges();

      const spinnerElement = fixture.debugElement.query(
        By.css("mat-progress-spinner"),
      );
      expect(spinnerElement.componentInstance.strokeWidth).toBe(
        testStrokeWidth,
      );
    });

    it("should set correct color on mat-progress-spinner", () => {
      const testColor: ThemePalette = "primary";
      component.color = testColor;
      fixture.detectChanges();

      const spinnerElement = fixture.debugElement.query(
        By.css("mat-progress-spinner"),
      );
      expect(spinnerElement.componentInstance.color).toBe(testColor);
    });

    it("should set correct value on mat-progress-spinner", () => {
      const testValue = 75;
      component.value = testValue;
      fixture.detectChanges();

      const spinnerElement = fixture.debugElement.query(
        By.css("mat-progress-spinner"),
      );
      expect(spinnerElement.componentInstance.value).toBe(testValue);
    });
  });

  describe("Edge cases", () => {
    it("should handle zero diameter", () => {
      component.isLoading = true;
      component.diameter = 0;
      fixture.detectChanges();

      const spinnerElement = fixture.debugElement.query(
        By.css("mat-progress-spinner"),
      );
      expect(spinnerElement.componentInstance.diameter).toBe(0);
    });
  });
});

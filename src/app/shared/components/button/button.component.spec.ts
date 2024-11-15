import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ButtonComponent } from "./button.component";

describe("ButtonComponent", () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Input properties", () => {
    it("should have default values", () => {
      expect(component.text).toBe("Button");
      expect(component.type).toBe("button");
      expect(component.isDisabled).toBeFalsy();
      expect(component.isActive).toBeFalsy();
      expect(component.customClasses).toBe("");
    });

    it("should set button type correctly", () => {
      const types: Array<"submit" | "button" | "reset"> = [
        "submit",
        "button",
        "reset",
      ];

      types.forEach((type) => {
        component.type = type;
        fixture.detectChanges();
        const buttonElement: HTMLButtonElement =
          fixture.nativeElement.querySelector("button");
        expect(buttonElement.type).toBe(type);
      });
    });

    it("should set disabled state correctly", () => {
      component.isDisabled = true;
      fixture.detectChanges();
      const buttonElement: HTMLButtonElement =
        fixture.nativeElement.querySelector("button");
      expect(buttonElement.disabled).toBeTruthy();
    });

    it("should apply active class when isActive is true", () => {
      component.isActive = true;
      fixture.detectChanges();
      const buttonElement: HTMLButtonElement =
        fixture.nativeElement.querySelector("button");
      expect(buttonElement.classList.contains("active")).toBeTruthy();
    });

    it("should apply custom classes", () => {
      const customClasses = "custom-class-1 custom-class-2";
      component.customClasses = customClasses;
      fixture.detectChanges();
      const buttonElement: HTMLButtonElement =
        fixture.nativeElement.querySelector("button");
      customClasses.split(" ").forEach((className) => {
        expect(buttonElement.classList.contains(className)).toBeTruthy();
      });
    });
  });

  describe("Output events", () => {
    it("should emit click event when clicked", () => {
      const spy = jest.spyOn(component.handleClick, "emit");
      const buttonElement: HTMLButtonElement =
        fixture.nativeElement.querySelector("button");

      buttonElement.click();
      expect(spy).toHaveBeenCalled();

      const emittedEvent = spy.mock.calls[0][0];
      expect(emittedEvent instanceof MouseEvent).toBeTruthy();
    });

    it("should not emit click event when disabled", () => {
      const spy = jest.spyOn(component.handleClick, "emit");
      component.isDisabled = true;
      fixture.detectChanges();

      const buttonElement: HTMLButtonElement =
        fixture.nativeElement.querySelector("button");
      buttonElement.click();

      expect(spy).not.toHaveBeenCalled();
    });
  });
});

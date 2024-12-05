import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { SearchDataComponent } from "./search-data.component";

describe("SearchDataComponent", () => {
  let component: SearchDataComponent;
  let fixture: ComponentFixture<SearchDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchDataComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe("Initial state", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should initialize with empty search term", () => {
      expect(component.searchTerm).toBe("");
      expect(component.searchControl.value).toBe("");
    });
  });

  describe("Form control behavior", () => {
    beforeEach(() => {
      jest.spyOn(component.searchValueChange, "emit");
    });

    it("should emit search term after debounce time", fakeAsync(() => {
      const searchTerm = "test search";
      component.searchControl.setValue(searchTerm);

      // No immediate emission due to debounceTime
      expect(component.searchValueChange.emit).not.toHaveBeenCalled();

      // After debounce time
      tick(300);
      expect(component.searchValueChange.emit).toHaveBeenCalledWith(searchTerm);
    }));

    it("should not emit if value has not changed", fakeAsync(() => {
      const searchTerm = "test";
      component.searchControl.setValue(searchTerm);
      tick(300);
      expect(component.searchValueChange.emit).toHaveBeenCalledTimes(1);

      // Set same value again
      component.searchControl.setValue(searchTerm);
      tick(300);
      expect(component.searchValueChange.emit).toHaveBeenCalledTimes(1);
    }));

    it("should handle empty search term", fakeAsync(() => {
      component.searchControl.setValue("");
      tick(300);
      expect(component.searchValueChange.emit).toHaveBeenCalledWith("");
    }));
  });

  describe("ngOnChanges", () => {
    beforeEach(() => {
      jest.spyOn(component.searchValueChange, "emit");
      jest.spyOn(component.searchControl, "setValue");
    });

    it("should update form control when searchTerm input changes", () => {
      const newSearchTerm = "new search";
      component.ngOnChanges({
        searchTerm: {
          currentValue: newSearchTerm,
          previousValue: "",
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.searchControl.setValue).toHaveBeenCalledWith(
        newSearchTerm,
        { emitEvent: false },
      );
    });

    it("should emit search value when searchTerm input changes", () => {
      const newSearchTerm = "new search";
      component.ngOnChanges({
        searchTerm: {
          currentValue: newSearchTerm,
          previousValue: "",
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.searchValueChange.emit).toHaveBeenCalledWith(
        newSearchTerm,
      );
    });

    it("should not emit if new searchTerm is empty", () => {
      component.ngOnChanges({
        searchTerm: {
          currentValue: "",
          previousValue: "old search",
          firstChange: false,
          isFirstChange: () => false,
        },
      });

      expect(component.searchValueChange.emit).not.toHaveBeenCalled();
    });
  });

  // describe("Cleanup", () => {
  //   it("should complete destroy$ subject on destroy", () => {
  //     const destroySpy = jest.spyOn(component["destroy$"], "complete");
  //     component.ngOnDestroy();
  //     expect(destroySpy).toHaveBeenCalled();
  //   });
  // });

  describe("RxJS operators", () => {
    beforeEach(() => {
      jest.spyOn(component.searchValueChange, "emit");
    });

    it("should debounce rapid value changes", fakeAsync(() => {
      component.searchControl.setValue("t");
      component.searchControl.setValue("te");
      component.searchControl.setValue("tes");
      component.searchControl.setValue("test");

      expect(component.searchValueChange.emit).not.toHaveBeenCalled();

      tick(300);
      expect(component.searchValueChange.emit).toHaveBeenCalledTimes(1);
      expect(component.searchValueChange.emit).toHaveBeenCalledWith("test");
    }));

    it("should handle multiple search terms with proper timing", fakeAsync(() => {
      component.searchControl.setValue("first");
      tick(300);
      expect(component.searchValueChange.emit).toHaveBeenCalledWith("first");

      component.searchControl.setValue("second");
      tick(300);
      expect(component.searchValueChange.emit).toHaveBeenCalledWith("second");

      expect(component.searchValueChange.emit).toHaveBeenCalledTimes(2);
    }));
  });
});

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PaginationComponent } from "./pagination.component";

describe("PaginationComponent", () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe("Initial state", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should have default values", () => {
      expect(component.totalItems).toBe(0);
      expect(component.itemsPerPage).toBe(5);
      expect(component.currentPage).toBe(0);
      expect(component.totalPages).toBe(0);
    });
  });

  describe("ngOnChanges", () => {
    it("should calculate total pages correctly", () => {
      component.totalItems = 21;
      component.itemsPerPage = 5;
      component.ngOnChanges();
      expect(component.totalPages).toBe(5);
    });

    it("should round up total pages when there is a remainder", () => {
      component.totalItems = 22;
      component.itemsPerPage = 5;
      component.ngOnChanges();
      expect(component.totalPages).toBe(5);
    });

    it("should handle zero total items", () => {
      component.totalItems = 0;
      component.itemsPerPage = 5;
      component.ngOnChanges();
      expect(component.totalPages).toBe(0);
    });

    it("should handle when items per page is greater than total items", () => {
      component.totalItems = 3;
      component.itemsPerPage = 5;
      component.ngOnChanges();
      expect(component.totalPages).toBe(1);
    });
  });

  describe("Navigation methods", () => {
    beforeEach(() => {
      component.totalItems = 25;
      component.itemsPerPage = 5;
      component.ngOnChanges();
      jest.spyOn(component.pageChange, "emit");
    });

    describe("onNext", () => {
      it("should increment current page and emit when not on last page", () => {
        component.currentPage = 1;
        component.onNext();
        expect(component.currentPage).toBe(2);
        expect(component.pageChange.emit).toHaveBeenCalledWith(2);
      });

      it("should not increment or emit when on last page", () => {
        component.currentPage = 5; // Last page
        component.onNext();
        expect(component.currentPage).toBe(5);
        expect(component.pageChange.emit).not.toHaveBeenCalled();
      });
    });

    describe("onPrevious", () => {
      it("should decrement current page and emit when not on first page", () => {
        component.currentPage = 2;
        component.onPrevious();
        expect(component.currentPage).toBe(1);
        expect(component.pageChange.emit).toHaveBeenCalledWith(1);
      });

      // it("should not decrement or emit when on first page", () => {
      //   component.currentPage = 1;
      //   component.onPrevious();
      //   expect(component.currentPage).toBe(1);
      //   expect(component.pageChange.emit).not.toHaveBeenCalled();
      // });
    });

    describe("onPageSelect", () => {
      it("should set current page and emit selected page", () => {
        component.onPageSelect(3);
        expect(component.currentPage).toBe(3);
        expect(component.pageChange.emit).toHaveBeenCalledWith(3);
      });

      // it("should handle selecting current page", () => {
      //   component.currentPage = 2;
      //   component.onPageSelect(2);
      //   expect(component.currentPage).toBe(2);
      //   expect(component.pageChange.emit).toHaveBeenCalledWith(2);
      // });

      it("should handle selecting first page", () => {
        component.currentPage = 3;
        component.onPageSelect(1);
        expect(component.currentPage).toBe(1);
        expect(component.pageChange.emit).toHaveBeenCalledWith(1);
      });

      it("should handle selecting last page", () => {
        component.currentPage = 1;
        component.onPageSelect(5);
        expect(component.currentPage).toBe(5);
        expect(component.pageChange.emit).toHaveBeenCalledWith(5);
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle itemsPerPage = 1", () => {
      component.totalItems = 5;
      component.itemsPerPage = 1;
      component.ngOnChanges();
      expect(component.totalPages).toBe(5);
    });

    it("should handle totalItems = 1", () => {
      component.totalItems = 1;
      component.itemsPerPage = 5;
      component.ngOnChanges();
      expect(component.totalPages).toBe(1);
    });

    it("should handle decimal itemsPerPage", () => {
      component.totalItems = 10;
      component.itemsPerPage = 2.5;
      component.ngOnChanges();
      expect(component.totalPages).toBe(4);
    });

    it("should handle negative values gracefully", () => {
      component.totalItems = -10;
      component.itemsPerPage = -5;
      component.ngOnChanges();
      expect(component.totalPages).toBe(2);
    });
  });
});

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

  describe("generatePages", () => {
    beforeEach(() => {
      component.itemsPerPage = 5;
    });

    it("should generate all pages when total pages <= maxVisiblePages", () => {
      component.totalItems = 20; // 4 pages
      component.ngOnChanges();
      expect(component.pages).toEqual([0, 1, 2, 3]);
    });

    it("should generate correct sequence with ellipsis for many pages", () => {
      component.totalItems = 100; // 20 pages
      component.currentPage = 10;
      component.ngOnChanges();
      expect(component.pages).toEqual([0, -1, 8, 9, 10, 11, -1, 19]);
    });

    it("should handle current page near start", () => {
      component.totalItems = 100;
      component.currentPage = 2;
      component.ngOnChanges();
      expect(component.pages).toEqual([0, 1, 2, 3, 4, -1, 19]);
    });

    it("should handle current page near end", () => {
      component.totalItems = 100;
      component.currentPage = 17;
      component.ngOnChanges();
      expect(component.pages).toEqual([0, -1, 16, 17, 18, 19]);
    });

    it("should handle single page", () => {
      component.totalItems = 5;
      component.ngOnChanges();
      expect(component.pages).toEqual([0]);
    });

    it("should handle zero pages", () => {
      component.totalItems = 0;
      component.ngOnChanges();
      expect(component.pages).toEqual([]);
    });

    it("should not show duplicate ellipsis", () => {
      component.totalItems = 50; // 10 pages
      component.currentPage = 5;
      component.ngOnChanges();
      const ellipsisCount = component.pages.filter(
        (page) => page === -1,
      ).length;
      expect(ellipsisCount).toBeLessThanOrEqual(2);
      expect(component.pages.indexOf(-1)).not.toBe(
        component.pages.lastIndexOf(-1),
      );
    });

    it("should always include first and last pages", () => {
      component.totalItems = 100;
      component.currentPage = 10;
      component.ngOnChanges();
      expect(component.pages[0]).toBe(0);
      expect(component.pages[component.pages.length - 1]).toBe(19);
    });
  });

  describe("isCurrentPage", () => {
    beforeEach(() => {
      component.currentPage = 5;
    });

    it("should return true for current page", () => {
      expect(component.isCurrentPage(5)).toBe(true);
    });

    it("should return false for non-current page", () => {
      expect(component.isCurrentPage(3)).toBe(false);
    });

    it("should handle zero page", () => {
      component.currentPage = 0;
      expect(component.isCurrentPage(0)).toBe(true);
    });

    it("should handle ellipsis value", () => {
      expect(component.isCurrentPage(-1)).toBe(false);
    });
  });
});

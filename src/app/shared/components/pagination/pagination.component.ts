import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
} from "@angular/core";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrl: "./pagination.component.scss",
})
export class PaginationComponent implements OnChanges {
  @Input() totalItems = 0;
  @Input() itemsPerPage = 5;
  @Input() currentPage = 0;
  @Input() totalPages = 0;
  @Output() pageChange = new EventEmitter<number>();
  pages: number[] = [];

  ngOnChanges(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.generatePages();
  }

  generatePages(): void {
    const maxVisiblePages = 5; // Number of page buttons to show (excluding ellipsis)
    this.pages = [];

    if (this.totalPages <= maxVisiblePages) {
      // If total pages is less than or equal to max visible pages, show all
      for (let i = 0; i < this.totalPages; i++) {
        this.pages.push(i);
      }
      return;
    }

    // Always show first page
    this.pages.push(0);

    // Calculate the start and end of the visible page range
    let startPage = Math.max(
      1,
      Math.min(this.currentPage - 2, this.totalPages - maxVisiblePages + 1),
    );
    const endPage = Math.min(
      startPage + maxVisiblePages - 2,
      this.totalPages - 2,
    );

    // Adjust startPage if endPage is too close to the last page
    if (endPage === this.totalPages - 2) {
      startPage = Math.max(1, this.totalPages - maxVisiblePages + 1);
    }

    // Add ellipsis after first page if needed
    if (startPage > 1) {
      this.pages.push(-1);
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      this.pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < this.totalPages - 2) {
      this.pages.push(-1);
    }

    // Always show last page
    this.pages.push(this.totalPages - 1);
  }

  onNext(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.pageChange.emit(this.currentPage);
      this.generatePages();
    }
  }

  onPrevious(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.pageChange.emit(this.currentPage);
      this.generatePages();
    }
  }

  onPageSelect(page: number): void {
    if (page !== -1 && page !== this.currentPage) {
      this.currentPage = page;
      this.pageChange.emit(this.currentPage);
      this.generatePages();
    }
  }

  isCurrentPage(page: number): boolean {
    return this.currentPage === page;
  }
}

import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  takeUntil,
} from "rxjs";

@Component({
  selector: "app-search-data",
  templateUrl: "./search-data.component.html",
  styleUrl: "./search-data.component.scss",
})
export class SearchDataComponent implements OnInit, OnDestroy, OnChanges {
  @Output() searchValueChange = new EventEmitter<string>();
  @Input() searchTerm = "";

  searchControl = new FormControl("");
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Handle search input changes
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((searchTerm) => searchTerm !== null),
        takeUntil(this.destroy$),
      )
      .subscribe((searchTerm) => {
        this.searchValueChange.emit(searchTerm || "");
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["searchTerm"] && changes["searchTerm"].currentValue) {
      const searchTerm = changes["searchTerm"].currentValue;

      // Update form control without triggering valueChanges
      this.searchControl.setValue(searchTerm, { emitEvent: false });

      // Emit search if searchTerm exists
      if (searchTerm.length > 0) {
        this.searchValueChange.emit(searchTerm);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

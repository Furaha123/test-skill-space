import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { debounceTime, distinctUntilChanged, filter } from "rxjs";

@Component({
  selector: "app-search-data",
  templateUrl: "./search-data.component.html",
  styleUrl: "./search-data.component.scss",
})
export class SearchDataComponent implements OnChanges {
  @Output() searchValueChange = new EventEmitter<string>();
  @Input() searchTerm = "";

  searchControl = new FormControl("");

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((searchTerm): searchTerm is string => searchTerm !== null),
        takeUntilDestroyed(),
      )
      .subscribe((searchTerm) => {
        this.searchValueChange.emit(searchTerm || "");
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["searchTerm"]?.currentValue) {
      const searchTerm = changes["searchTerm"].currentValue;
      this.searchControl.setValue(searchTerm, { emitEvent: false });

      if (searchTerm.length > 0) {
        this.searchValueChange.emit(searchTerm);
      }
    }
  }
}

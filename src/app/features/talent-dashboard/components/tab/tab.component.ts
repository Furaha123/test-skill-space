import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-tab",
  templateUrl: "./tab.component.html",
  styleUrls: ["./tab.component.scss"],
})
export class TabComponent {
  @Input() universityName = "";
  @Output() backToRecords = new EventEmitter<void>();

  onBackToRecords(): void {
    this.backToRecords.emit();
  }
}

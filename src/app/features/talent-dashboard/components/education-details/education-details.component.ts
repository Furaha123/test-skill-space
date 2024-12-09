import { Component, EventEmitter, Input, Output } from "@angular/core";

interface EducationRecord {
  degree: string;
  institution: string;
  filesCount: number;
}

@Component({
  selector: "app-education-details",
  templateUrl: "./education-details.component.html",
  styleUrls: ["./education-details.component.scss"],
})
export class EducationDetailsComponent {
  @Input() record!: EducationRecord; // Receives the record to update
  @Output() cancel = new EventEmitter<void>(); // Emits when the user cancels
  @Output() saveRecord = new EventEmitter<EducationRecord>(); // Emits the updated record

  onSave(): void {
    this.saveRecord.emit(this.record);
  }
}

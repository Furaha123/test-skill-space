import { Component, Input, Output, EventEmitter } from "@angular/core";
import {
  JobPostingData,
  CardVariant,
  JobType,
} from "../models/job-posting-card.interface";

@Component({
  selector: "app-job-posting-card",
  templateUrl: "./job-posting-card.component.html",
  styleUrls: ["./job-posting-card.component.scss"],
})
export class JobPostingCardComponent {
  @Input() jobPosting!: JobPostingData;
  @Input() variant: CardVariant = "company";
  @Input() isEditable = false;
  @Output() editClicked = new EventEmitter<string>();
  @Output() deleteClicked = new EventEmitter<string>();
  @Output() applyClicked = new EventEmitter<string>();
  @Output() bookmarkClicked = new EventEmitter<string>();

  protected showDropdown = false;

  protected getJobTypeClass(type: JobType): string {
    return type.toLowerCase().replace("-", "");
  }

  protected hasProgramTechnologies(): boolean {
    return !!(
      this.jobPosting.programDetails?.technologies &&
      this.jobPosting.programDetails.technologies.length > 0
    );
  }

  protected hasProgramDates(): boolean {
    return !!(
      this.jobPosting.programDetails?.startDate &&
      this.jobPosting.programDetails.endDate
    );
  }

  protected toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  protected onEditClick(event: Event): void {
    event.stopPropagation();
    this.editClicked.emit(this.jobPosting.id);
    this.showDropdown = false;
  }

  protected onDeleteClick(event: Event): void {
    event.stopPropagation();
    this.deleteClicked.emit(this.jobPosting.id);
    this.showDropdown = false;
  }

  protected closeDropdown(): void {
    this.showDropdown = false;
  }
}

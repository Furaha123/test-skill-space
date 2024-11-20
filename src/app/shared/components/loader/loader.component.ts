import { Component, Input } from "@angular/core";
import { ThemePalette } from "@angular/material/core";
@Component({
  selector: "app-loader",
  template: ` <section *ngIf="isLoading" class="overlay">
    <div class="loader-container">
      <div class="spinner-wrapper">
        <mat-progress-spinner
          [diameter]="diameter"
          [strokeWidth]="strokeWidth"
          [color]="color"
          [value]="value"
          class="custom-spinner"
        >
        </mat-progress-spinner>
      </div>
    </div>
  </section>`,
  styleUrl: "./loader.component.scss",
})
export class LoaderComponent {
  @Input() isLoading = false;
  @Input() diameter = 100;
  @Input() strokeWidth = 10;
  @Input() color: ThemePalette = "accent";
  @Input() value = 50;
}

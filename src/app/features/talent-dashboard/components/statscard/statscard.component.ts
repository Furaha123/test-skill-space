import { Component, Input } from "@angular/core";
import { StatCardData, StatTrend } from "../../models/talent.interfaces";

type IconColorType = "primary" | "secondary" | "tertiary" | "neutral";

@Component({
  selector: "app-statscard",
  templateUrl: "./statscard.component.html",
  styleUrl: "./statscard.component.scss",
})
export class StatscardComponent {
  @Input() data!: StatCardData;
  @Input() iconColor: IconColorType = "primary";

  calculateTrendDirection(value: number): boolean {
    return value >= 0;
  }

  formatTrendValue(value: number): string {
    const sign = value > 0 ? "+" : "";
    return `${sign}${value}%`;
  }

  formatStatValue(value: number | string): string {
    if (typeof value === "number") {
      return value.toLocaleString();
    }
    return value;
  }

  getTrendClass(trend: StatTrend): string {
    return this.calculateTrendDirection(trend.value)
      ? "trend--positive"
      : "trend--negative";
  }

  getIconClass(): string {
    return `icon--${this.iconColor}`;
  }
}

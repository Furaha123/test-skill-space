import { Component } from "@angular/core";

@Component({
  selector: "app-talent-profile",
  templateUrl: "./talent-profile.component.html",
  styleUrl: "./talent-profile.component.scss",
})
export class TalentProfileComponent {
  selectedTabIndex = 0;

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }
}

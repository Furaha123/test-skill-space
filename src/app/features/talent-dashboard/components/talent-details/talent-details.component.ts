import { Component } from "@angular/core";

@Component({
  selector: "app-talent-details",
  templateUrl: "./talent-details.component.html",
  styleUrls: ["./talent-details.component.scss"],
})
export class TalentDetailsComponent {
  wordCount = 0;
  maxWordLimit = 250;
  introductionText = "";
  selectedIcon: string; // Holds the currently selected icon
  isDropdownOpen = false;

  icons = [
    { name: "Behance", imageUrl: "assets/icon/social/behance.png" },
    { name: "Dribble", imageUrl: "assets/icon/social/dribble.png" },
    { name: "Messenger", imageUrl: "assets/icon/social/messenger.png" },
    { name: "Linkedln", imageUrl: "assets/icon/social/linkedin.png" },
    { name: "Twitter", imageUrl: "assets/icon/social/twitter.png" },
    { name: "Instagram", imageUrl: "assets/icon/social/insta.png" },
  ];

  constructor() {
    // Set the first icon as the default selected icon
    this.selectedIcon = this.icons[0].name;
  }

  getIconImage(iconName: string): string | undefined {
    const selected = this.icons.find((icon) => icon.name === iconName);
    return selected?.imageUrl;
  }

  onTextChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    if (textarea) {
      this.wordCount = textarea.value.trim().length;
      this.introductionText = textarea.value;
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectIcon(iconName: string): void {
    this.selectedIcon = iconName;
    this.isDropdownOpen = false;
  }
}

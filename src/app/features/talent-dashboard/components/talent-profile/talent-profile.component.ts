import { Component, OnInit } from "@angular/core";
import { TalentProfileService } from "../../services/talent-profile.service";
import { PersonalDetails } from "../../models/personal.detalis.interface";

@Component({
  selector: "app-talent-profile",
  templateUrl: "./talent-profile.component.html",
  styleUrl: "./talent-profile.component.scss",
})
export class TalentProfileComponent implements OnInit {
  selectedTabIndex = 0;
  personalDetails!: PersonalDetails;
  error = false;

  constructor(private readonly talentProfileService: TalentProfileService) {}

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }

  ngOnInit(): void {
    this.talentProfileService.getPersonalDetails().subscribe({
      next: (response) => {
        this.personalDetails = response.data;
        this.error = false;
      },
      error: () => {
        this.error = true;
      },
    });
  }
}

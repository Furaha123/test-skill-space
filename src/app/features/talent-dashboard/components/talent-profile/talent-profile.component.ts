import { Component, OnInit } from "@angular/core";
import { TalentProfileService } from "../../services/talent-profile.service";
import {
  ApiResponse,
  PersonalDetails,
  UserInfo,
} from "../../models/personal.detalis.interface";
import { Observable } from "rxjs";

@Component({
  selector: "app-talent-profile",
  templateUrl: "./talent-profile.component.html",
  styleUrl: "./talent-profile.component.scss",
})
export class TalentProfileComponent implements OnInit {
  selectedTabIndex = 0;
  personalDetails!: PersonalDetails;
  error = false;
  userInfo$: Observable<ApiResponse<UserInfo>>;

  constructor(private readonly talentProfileService: TalentProfileService) {
    this.userInfo$ = this.fetchUserInfo();
  }

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

  private fetchUserInfo(): Observable<ApiResponse<UserInfo>> {
    return this.talentProfileService.getUserInfo();
  }
}

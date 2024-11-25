import { Component, OnInit } from "@angular/core";
import { TalentProfileService } from "../../services/talent-profile.service";
import { PersonalDetails } from "../../models/personal.detalis.interface";
import { ToastrService } from "ngx-toastr";
import { Observable, EMPTY } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-talent-details",
  templateUrl: "./talent-details.component.html",
  styleUrls: ["./talent-details.component.scss"],
})
export class TalentDetailsComponent implements OnInit {
  personalDetails$: Observable<PersonalDetails> | null = null;
  wordCount = 0;
  maxWordLimit = 250;
  introductionText = "";
  selectedIcon = "Behance";
  isDropdownOpen = false;
  profileForm: FormGroup;

  icons = [
    { name: "Behance", imageUrl: "assets/icon/social/behance.png" },
    { name: "Dribble", imageUrl: "assets/icon/social/dribble.png" },
    { name: "Messenger", imageUrl: "assets/icon/social/messenger.png" },
    { name: "LinkedIn", imageUrl: "assets/icon/social/linkedin.png" },
    { name: "Twitter", imageUrl: "assets/icon/social/twitter.png" },
    { name: "Instagram", imageUrl: "assets/icon/social/insta.png" },
  ];

  constructor(
    private readonly talentProfileService: TalentProfileService,
    private readonly toastr: ToastrService,
    private readonly fb: FormBuilder,
  ) {
    this.profileForm = this.fb.group({
      socialMediaLinks: this.fb.array([]),
      portfolioLinks: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.fetchPersonalDetails();
  }

  private initializeForm(): void {
    this.addSocialMedia();

    this.addPortfolio();
  }

  private fetchPersonalDetails(): void {
    this.personalDetails$ = this.talentProfileService.getPersonalDetails().pipe(
      tap((details) => {
        this.introductionText = details.introduction ?? "";
        this.wordCount = this.introductionText.trim().length;
        this.toastr.success("Personal Details fetched successfully", "Success");
      }),
      catchError((err) => {
        const errorMessage =
          err.error?.message ?? "Failed to fetch personal details";
        this.handleError(errorMessage);
        return EMPTY;
      }),
    );
  }

  private handleError(message: string): void {
    this.toastr.error(message, "Error");
  }

  getIconImage(iconName: string): string | undefined {
    return this.icons.find((icon) => icon.name === iconName)?.imageUrl;
  }

  onTextChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    if (textarea) {
      this.wordCount = textarea.value.trim().split(/\s+/).length;
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

  get socialMediaLinks(): FormArray {
    return this.profileForm.get("socialMediaLinks") as FormArray;
  }

  get portfolioLinks(): FormArray {
    return this.profileForm.get("portfolioLinks") as FormArray;
  }

  addSocialMedia(): void {
    const socialMediaForm = this.fb.group({
      icon: [this.selectedIcon || "", Validators.required],
      url: ["", [Validators.required, Validators.pattern(/^https?:\/\/.+$/)]],
    });
    this.socialMediaLinks.push(socialMediaForm);
  }

  removeSocialMedia(index: number): void {
    if (this.socialMediaLinks.length > 1) {
      this.socialMediaLinks.removeAt(index);
    } else {
      this.socialMediaLinks.at(0).reset();
    }
  }

  addPortfolio(): void {
    const portfolioForm = this.fb.group({
      url: ["", [Validators.required, Validators.pattern(/^https?:\/\/.+$/)]],
    });
    this.portfolioLinks.push(portfolioForm);
  }

  removePortfolio(index: number): void {
    if (this.portfolioLinks.length > 1) {
      this.portfolioLinks.removeAt(index);
    } else {
      this.portfolioLinks.at(0).reset();
    }
  }

  getSocialMediaGroup(index: number): FormGroup {
    return this.socialMediaLinks.at(index) as FormGroup;
  }

  getPortfolioGroup(index: number): FormGroup {
    return this.portfolioLinks.at(index) as FormGroup;
  }
}

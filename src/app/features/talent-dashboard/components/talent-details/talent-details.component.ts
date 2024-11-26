/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TalentProfileService } from "../../services/talent-profile.service";
import { PersonalDetails } from "../../models/personal.detalis.interface";
import { Observable } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

interface FileUpload {
  file: File;
  previewUrl?: string;
  name: string;
}

interface SocialMedia {
  name: string;
  url: string;
}

@Component({
  selector: "app-talent-details",
  templateUrl: "./talent-details.component.html",
  styleUrls: ["./talent-details.component.scss"],
})
export class TalentDetailsComponent implements OnInit {
  profileForm!: FormGroup;
  personalDetails$: Observable<PersonalDetails> | null = null;
  isDropdownOpen: { [key: number]: boolean } = {};
  selectedIcons: { [key: number]: string } = {};
  wordCount = 0;
  maxWordLimit = 250;

  profileUpload: FileUpload | null = null;
  cvUpload: FileUpload | null = null;
  imagePreviewUrl: string | null = null;
  cvFileName: string | null = null;

  icons = [
    { name: "Behance", imageUrl: "assets/icon/social/behance.png" },
    { name: "Dribble", imageUrl: "assets/icon/social/dribble.png" },
    { name: "Messenger", imageUrl: "assets/icon/social/messenger.png" },
    { name: "LinkedIn", imageUrl: "assets/icon/social/linkedin.png" },
    { name: "Twitter", imageUrl: "assets/icon/social/twitter.png" },
    { name: "Instagram", imageUrl: "assets/icon/social/insta.png" },
  ];

  constructor(
    private readonly fb: FormBuilder,
    public readonly talentProfileService: TalentProfileService,
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.profileForm.get("introduction")?.valueChanges.subscribe((value) => {
      this.wordCount = value ? value.trim().split(/\s+/).length : 0;
    });
    this.fetchTalentDetails();
  }
  public fetchTalentDetails(): void {
    this.personalDetails$ = this.talentProfileService.getPersonalDetails();
    this.personalDetails$.subscribe({
      next: (details) => {
        if (details) {
          this.profileForm.patchValue({
            firstName: details.firstName,
            lastName: details.lastName,
            introduction: details.introduction,
            dateOfBirth: details.birthDate,
            nationality: details.nationality,
            currentLocation: details.currentLocation,
            phoneNumber: details.phoneNumber,
            phoneVisibility: details.phoneVisibility,
          });
          if (details.socialMedia?.length) {
            this.populateSocialMediaLinks(details.socialMedia);
          }
          if (details.portfolios?.length) {
            this.populatePortfolioLinks(details.portfolios);
          }
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error("Error fetching talent details:", error);
      },
    });
  }
  private initializeForm(): void {
    this.profileForm = this.fb.group({
      profilePicture: [null],
      cv: [null],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      introduction: ["", [Validators.required, Validators.maxLength(250)]],
      dateOfBirth: ["", Validators.required],
      nationality: ["", Validators.required],
      currentLocation: ["", Validators.required],
      phoneNumber: ["", Validators.required],
      phoneVisibility: ["private", Validators.required],
      socialMedia: this.fb.array([]),
      portfolioLinks: this.fb.array([]),
    });

    this.addSocialMedia();
    this.addPortfolio();
  }

  public populateSocialMediaLinks(socialMedia: SocialMedia[]): void {
    const socialMediaArray = this.socialMedia;
    while (socialMediaArray.length) {
      socialMediaArray.removeAt(0);
    }

    socialMedia.forEach((link, index) => {
      socialMediaArray.push(
        this.fb.group({
          name: [link.name, Validators.required],
          url: [
            link.url,
            [Validators.required, Validators.pattern(/^https?:\/\/.+$/)],
          ],
        }),
      );
      this.selectedIcons[index] = link.name;
      this.isDropdownOpen[index] = false;
    });
  }

  public populatePortfolioLinks(portfolios: { url: string }[]): void {
    const portfolioLinksArray = this.portfolioLinks;
    while (portfolioLinksArray.length) {
      portfolioLinksArray.removeAt(0);
    }

    portfolios.forEach((link) => {
      portfolioLinksArray.push(
        this.fb.group({
          url: [
            link.url,
            [Validators.required, Validators.pattern(/^https?:\/\/.+$/)],
          ],
        }),
      );
    });
  }

  get socialMedia(): FormArray {
    return this.profileForm.get("socialMedia") as FormArray;
  }

  get portfolioLinks(): FormArray {
    return this.profileForm.get("portfolioLinks") as FormArray;
  }

  addSocialMedia(): void {
    const socialMediaForm = this.fb.group({
      name: ["", Validators.required],
      url: ["", [Validators.required, Validators.pattern(/^https?:\/\/.+$/)]],
    });

    const newIndex = this.socialMedia.length;
    this.socialMedia.push(socialMediaForm);
    this.selectedIcons[newIndex] = "";
    this.isDropdownOpen[newIndex] = false;
  }

  public isValidFileType(file: File, type: "image" | "cv"): boolean {
    const allowedTypes = {
      image: ["image/jpeg", "image/jpg", "image/png"],
      cv: ["application/pdf"],
    };
    return allowedTypes[type].includes(file.type);
  }

  public isValidFileSize(file: File): boolean {
    const maxSize = 5 * 1024 * 1024;
    return file.size <= maxSize;
  }

  public createFilePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onFileSelected(event: any, type: "image" | "cv"): void {
    const file = event.target.files[0];
    const fileUpload: FileUpload = {
      file,
      name: file.name,
    };

    if (type === "image") {
      this.createFilePreview(file);
      this.profileUpload = fileUpload;
    } else {
      this.cvUpload = fileUpload;
      this.cvFileName = fileUpload.name;
    }

    this.profileForm.patchValue({
      [type === "image" ? "profilePicture" : "cv"]: file,
    });

    console.log(`${type === "image" ? "Profile picture" : "CV"} selected:`, {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    });
  }

  toggleDropdown(index: number): void {
    Object.keys(this.isDropdownOpen).forEach((key) => {
      if (Number(key) !== index) {
        this.isDropdownOpen[Number(key)] = false;
      }
    });
    this.isDropdownOpen[index] = !this.isDropdownOpen[index];
  }

  selectIcon(iconName: string, index: number): void {
    this.selectedIcons[index] = iconName;
    this.isDropdownOpen[index] = false;
    const socialMediaGroup = this.getSocialMediaGroup(index);
    socialMediaGroup.patchValue({ name: iconName });
  }

  removeSocialMedia(index: number): void {
    if (this.socialMedia.length > 1) {
      this.socialMedia.removeAt(index);
      delete this.selectedIcons[index];
      delete this.isDropdownOpen[index];
      this.reindexTrackingObjects();
    } else {
      this.socialMedia.at(0).reset();
      this.selectedIcons[0] = "";
    }
  }

  removeFile(type: "image" | "cv"): void {
    if (type === "image") {
      this.profileUpload = null;
      this.imagePreviewUrl = null;
      this.profileForm.patchValue({ profilePicture: null });
    } else {
      this.cvUpload = null;
      this.cvFileName = null;
      this.profileForm.patchValue({ cv: null });
    }
  }

  public reindexTrackingObjects(): void {
    const newSelectedIcons: { [key: number]: string } = {};
    const newIsDropdownOpen: { [key: number]: boolean } = {};

    this.socialMedia.controls.forEach((_, index) => {
      if (this.selectedIcons[index + 1] !== undefined) {
        newSelectedIcons[index] = this.selectedIcons[index + 1];
        newIsDropdownOpen[index] = this.isDropdownOpen[index + 1];
      }
    });

    this.selectedIcons = newSelectedIcons;
    this.isDropdownOpen = newIsDropdownOpen;
  }

  openFileSelector(type: "image" | "cv"): void {
    const selector =
      type === "image" ? ".profile-upload input" : ".cv-upload input";
    const fileInput = document.querySelector(selector) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDrop(event: DragEvent, type: "image" | "cv"): void {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];

      const transferEvent = {
        target: {
          files: [file],
        },
      };

      this.onFileSelected(transferEvent, type);
    }
  }

  getSelectedIcon(index: number): string {
    return this.selectedIcons[index] || "";
  }

  isDropdownOpenForIndex(index: number): boolean {
    return this.isDropdownOpen[index] || false;
  }

  getIconImage(iconName: string): string | undefined {
    return this.icons.find((icon) => icon.name === iconName)?.imageUrl;
  }

  getSocialMediaGroup(index: number): FormGroup {
    return this.socialMedia.at(index) as FormGroup;
  }

  getPortfolioGroup(index: number): FormGroup {
    return this.portfolioLinks.at(index) as FormGroup;
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

  isSocialMediaValid(index: number): boolean {
    const group = this.getSocialMediaGroup(index);
    return group.valid && group.touched;
  }

  isSocialMediaInvalid(index: number): boolean {
    const group = this.getSocialMediaGroup(index);
    return group.invalid && group.touched;
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  handleUpdate(): void {
    const formValue = { ...this.profileForm.value };
    formValue.socialMedia = formValue.socialMedia.map((item: any) => ({
      name: item.name,
      url: item.url,
    }));

    console.log("Form Value Before Submit:", formValue);

    this.talentProfileService.patchPersonalDetails(formValue).subscribe({
      next: (updatedDetails) => {
        console.log("Personal Details Updated Successfully:", updatedDetails);
      },
      error: (err: HttpErrorResponse) => {
        console.error("Error updating personal details:", err);
        console.error("Error details:", err.error);
      },
    });
  }

  onDateOfBirthSelected(selectedDate: Date): void {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    this.profileForm.patchValue({ dateOfBirth: formattedDate });
  }
}

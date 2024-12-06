import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { TalentProfileService } from "../../services/talent-profile.service";
import {
  ApiResponse,
  PersonalDetails,
} from "../../models/personal.detalis.interface";
import { catchError, finalize, takeUntil } from "rxjs/operators";
import { of, Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-personal-details-update",
  templateUrl: "./personal-details-update.component.html",
  styleUrls: ["./personal-details-update.component.scss"],
})
export class PersonalDetailsUpdateComponent implements OnInit, OnDestroy {
  @Input() personalDetails!: PersonalDetails;
  @Output() cancelEdit = new EventEmitter<void>();

  personalDetailsForm: FormGroup;
  selectedIcon = "";
  isDropdownOpen = false;
  errorMessage = "";
  private destroy$ = new Subject<void>();

  icons = [
    { name: "LinkedIn", imageUrl: "assets/icon/social/linkedin.png" },
    { name: "GitHub", imageUrl: "assets/icon/social/github.png" },
    { name: "Behance", imageUrl: "assets/icon/social/behance.png" },
    { name: "Dribble", imageUrl: "assets/icon/social/dribble.png" },
    { name: "Twitter", imageUrl: "assets/icon/social/twitter.png" },
    { name: "Instagram", imageUrl: "assets/icon/social/insta.png" },
  ];

  constructor(
    private fb: FormBuilder,
    private talentProfileService: TalentProfileService,
    private toastService: ToastrService,
  ) {
    this.personalDetailsForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      introduction: ["", [Validators.required, Validators.maxLength(250)]],
      birthDate: ["", Validators.required],
      nationality: ["", Validators.required],
      currentLocation: ["", Validators.required],
      phoneNumber: ["", Validators.required],
      phoneVisibility: ["public"],
      profilePictureUrl: [""],
      cvUrl: [""],
      socialMedia: this.fb.array([]),
      portfolios: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadPersonalDetails();
  }

  loadPersonalDetails(): void {
    if (this.personalDetails) {
      this.personalDetailsForm.patchValue(this.personalDetails);
      this.setUpSocialMediaFormArray();
      this.setUpPortfoliosFormArray();
    } else {
      this.talentProfileService
        .getPersonalDetails()
        .pipe(
          takeUntil(this.destroy$),
          catchError(() => {
            this.errorMessage = "Failed to load personal details";
            return of({
              status: "error",
              message: this.errorMessage,
              data: null,
            });
          }),
        )
        .subscribe(
          (
            response:
              | ApiResponse<PersonalDetails>
              | { status: string; message: string; data: null },
          ) => {
            if (response.data) {
              this.personalDetails = response.data;
              this.personalDetailsForm.patchValue(this.personalDetails);
              this.setUpSocialMediaFormArray();
              this.setUpPortfoliosFormArray();
            } else {
              this.errorMessage = "No personal details available";
            }
          },
        );
    }
  }

  setUpSocialMediaFormArray(): void {
    const socialMediaFormArray = this.personalDetailsForm.get(
      "socialMedia",
    ) as FormArray;
    socialMediaFormArray.clear();
    if (this.personalDetails?.socialMedia) {
      this.personalDetails.socialMedia.forEach((social) => {
        socialMediaFormArray.push(
          this.fb.group({
            name: [social.name],
            url: [social.url],
          }),
        );
      });
    }
  }

  setUpPortfoliosFormArray(): void {
    const portfoliosFormArray = this.personalDetailsForm.get(
      "portfolios",
    ) as FormArray;
    portfoliosFormArray.clear();
    if (this.personalDetails?.portfolios) {
      this.personalDetails.portfolios.forEach((portfolio) => {
        portfoliosFormArray.push(this.fb.control(portfolio));
      });
    }
  }

  get socialMediaControls() {
    return (this.personalDetailsForm.get("socialMedia") as FormArray).controls;
  }

  get portfolioControls() {
    return (this.personalDetailsForm.get("portfolios") as FormArray).controls;
  }

  addSocialMedia(): void {
    const socialMediaFormArray = this.personalDetailsForm.get(
      "socialMedia",
    ) as FormArray;
    socialMediaFormArray.push(
      this.fb.group({
        name: [""],
        url: [""],
      }),
    );
  }

  removeSocialMedia(index: number): void {
    const socialMediaFormArray = this.personalDetailsForm.get(
      "socialMedia",
    ) as FormArray;
    socialMediaFormArray.removeAt(index);
  }

  addPortfolio(): void {
    const portfoliosFormArray = this.personalDetailsForm.get(
      "portfolios",
    ) as FormArray;
    portfoliosFormArray.push(this.fb.control(""));
  }

  removePortfolio(index: number): void {
    const portfoliosFormArray = this.personalDetailsForm.get(
      "portfolios",
    ) as FormArray;
    portfoliosFormArray.removeAt(index);
  }
  onSubmit(): void {
    if (this.personalDetailsForm.valid) {
      const updatedDetails: PersonalDetails = this.personalDetailsForm.value;

      this.talentProfileService
        .updatePersonalDetails(updatedDetails)
        .pipe(
          takeUntil(this.destroy$),
          catchError(() => {
            this.toastService.error("Failed to update personal details");
            return of({
              status: "error",
              message: "Failed to update personal details",
              data: null,
            });
          }),
          finalize(() => this.cancelEdit.emit()),
        )
        .subscribe(
          (
            response:
              | ApiResponse<PersonalDetails>
              | { status: string; message: string; data: null },
          ) => {
            if (response.status === "success") {
              this.toastService.success(
                "Personal details updated successfully",
              );
            } else {
              this.toastService.error(response.message);
            }
          },
        );
    } else {
      this.toastService.error("Please fill in all required fields correctly.");
    }
  }

  onCancel(): void {
    this.cancelEdit.emit();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectIcon(iconName: string): void {
    this.selectedIcon = iconName;
    this.isDropdownOpen = false;
  }

  getIconImage(iconName: string): string | undefined {
    const selected = this.icons.find((icon) => icon.name === iconName);
    return selected?.imageUrl;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFileChange(event: Event, type: "profilePictureUrl" | "cvUrl"): void {
    const file = this.getFileFromEvent(event);
    if (file) {
      this.handleFileUpload(file, type);
    }
  }

  private handleFileUpload(
    file: File,
    type: "profilePictureUrl" | "cvUrl",
  ): void {
    if (!this.isValidFileSize(file)) {
      this.handleUploadError("File size exceeds 10MB limit");
      return;
    }

    if (!this.isValidFileType(file, type)) {
      this.handleUploadError(
        `Invalid file type for ${this.getFileTypeDescription(type)}`,
      );
      return;
    }

    this.uploadFile(file, type);
  }

  private getFileFromEvent(event: Event): File | null {
    const input = event.target as HTMLInputElement;
    return input.files?.[0] || null;
  }

  private isValidFileSize(file: File): boolean {
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    return file.size <= maxSize;
  }

  private isValidFileType(
    file: File,
    type: "profilePictureUrl" | "cvUrl",
  ): boolean {
    const allowedTypes = this.getAllowedFileTypes(type);
    return allowedTypes.includes(file.type);
  }

  private getAllowedFileTypes(type: "profilePictureUrl" | "cvUrl"): string[] {
    const fileTypes = {
      profilePictureUrl: ["image/jpeg", "image/png"],
      cvUrl: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    };
    return fileTypes[type];
  }

  private getFileTypeDescription(type: "profilePictureUrl" | "cvUrl"): string {
    return type === "profilePictureUrl" ? "profile picture" : "CV";
  }

  private uploadFile(file: File, type: "profilePictureUrl" | "cvUrl"): void {
    this.personalDetailsForm.patchValue({ [type]: file });
  }

  private handleUploadError(message: string): void {
    this.errorMessage = message;
  }
}

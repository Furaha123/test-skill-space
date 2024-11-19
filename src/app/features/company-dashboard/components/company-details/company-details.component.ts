import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CompanyUser, CompanyContact } from "../../models/company-user";
import {
  getUserInformation,
  updateUserInformation,
} from "../../store/company-profile-actions";
import { Store } from "@ngrx/store";
import { Observable, BehaviorSubject } from "rxjs";
import { filter, tap } from "rxjs/operators";
import { selectCompanyUser } from "../../store/company-profile-selectors";

@Component({
  selector: "app-company-details",
  templateUrl: "./company-details.component.html",
  styleUrls: ["./company-details.component.scss"],
})
export class CompanyDetailsComponent implements OnInit {
  companyUser$: Observable<CompanyUser | null>;
  companyForm: FormGroup;
  isLoading$ = new BehaviorSubject<boolean>(true);
  isModalOpen = false;

  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024;
  private readonly MAX_WEBSITES = 5;

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
  ) {
    this.companyUser$ = this.store.select(selectCompanyUser);

    this.companyForm = this.fb.group({
      name: ["", Validators.required],
      countryCode: ["+1", Validators.required],
      phone: ["", [Validators.required, Validators.pattern(/^\d{3}-\d{4}$/)]],
      email: ["", [Validators.required, Validators.email]],
      websites: this.fb.array([this.createWebsiteControl()]),
      logo: [""],
      documentUrl: [""],
    });
  }

  ngOnInit(): void {
    this.store.dispatch(getUserInformation());

    this.companyUser$
      .pipe(
        filter((response): response is CompanyUser => !!response),
        tap(() => this.isLoading$.next(false)),
      )
      .subscribe({
        next: (data: CompanyUser) => {
          this.patchFormValues(data);
        },
      });
  }

  patchFormValues(data: CompanyUser): void {
    const phone = data.contact?.phone ?? "";
    const countryCode = phone.split("-")[0] || "+1";
    const remainingPhone = phone.substring(countryCode.length + 1) || "";

    this.companyForm.patchValue({
      name: data.name ?? "",
      countryCode: countryCode,
      phone: remainingPhone,
      email: data.contact?.email ?? "",
      logo: data.logo ?? "",
      documentUrl: data.documentUrl ?? "",
    });

    const websitesArray = this.companyForm.get("websites") as FormArray;
    while (websitesArray.length) {
      websitesArray.removeAt(0);
    }

    if (data.contact?.website) {
      websitesArray.push(
        this.fb.control(data.contact.website, {
          validators: [
            Validators.required,
            Validators.pattern(
              /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
            ),
          ],
          nonNullable: true,
        }),
      );
    }
  }

  createWebsiteControl(): FormControl<string | null> {
    return this.fb.control("", {
      validators: [
        Validators.required,
        Validators.pattern(
          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
        ),
      ],
      nonNullable: true,
    });
  }

  get websites(): FormArray {
    return this.companyForm.get("websites") as FormArray;
  }

  addWebsite(): void {
    if (this.websites.length < this.MAX_WEBSITES) {
      this.websites.push(this.createWebsiteControl());
    }
  }

  removeWebsite(index: number): void {
    if (this.websites.length > 1) {
      this.websites.removeAt(index);
    }
  }

  onCountryCodeChange(code: string): void {
    this.companyForm.patchValue({
      countryCode: code,
    });
  }

  onFileSelected(event: Event, fileType: "logo" | "document"): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.size > this.MAX_FILE_SIZE) {
        alert("File size exceeds 5MB limit");
        return;
      }
      this.readFile(file, fileType);
    }
  }

  readFile(file: File, fileType: "logo" | "document"): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.companyForm.patchValue({
        [fileType]: e.target?.result as string,
      });
    };
    reader.readAsDataURL(file);
  }

  deleteFile(fileType: "logo" | "document") {
    this.companyForm.patchValue({
      [fileType]: "",
    });
  }

  onSave(): void {
    if (this.companyForm.invalid) {
      this.markFormGroupTouched(this.companyForm);
      return;
    }

    const formData = this.companyForm.value;
    const websiteValues = formData.websites;

    const contact: CompanyContact = {
      email: formData.email,
      phone: `${formData.countryCode}-${formData.phone}`,
      website: websiteValues[0] || "",
    };

    const updatedData: Partial<CompanyUser> = {
      name: formData.name,
      contact: contact,
      logo: formData.logo,
      documentUrl: formData.documentUrl,
    };

    this.store.dispatch(updateUserInformation({ updatedData }));

    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  public markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.companyForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  isWebsiteInvalid(index: number): boolean {
    const website = this.websites.at(index);
    return website.invalid && (website.dirty || website.touched);
  }
}

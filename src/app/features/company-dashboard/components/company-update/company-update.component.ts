import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, tap } from "rxjs/operators";
import { CompanyUser, UpdateCompanyUser } from "../../models/company-user";
import {
  getUserInformation,
  updateUserInformation,
} from "../../store/company-profile-actions";
import { selectCompanyUser } from "../../store/company-profile-selectors";
import { CompanyProfileService } from "../../services/company-profile.service";

@Component({
  selector: "app-company-update",
  templateUrl: "./company-update.component.html",
  styleUrls: ["./company-update.component.scss"],
})
export class CompanyUpdateComponent implements OnInit {
  @Output() closeEditor = new EventEmitter<void>();
  companyUser$: Observable<CompanyUser | null>;
  companyForm: FormGroup;
  initialData: CompanyUser | null = null;
  isLoading$ = new BehaviorSubject<boolean>(true);
  isModalOpen = false;

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private readonly companyProfileService: CompanyProfileService,
  ) {
    this.companyUser$ = this.store.select(selectCompanyUser);
    this.companyForm = this.fb.group({
      phoneNumber: [
        "",
        [Validators.required, Validators.pattern(/^\+\d{12}$/)],
      ],
      websiteUrl: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
          ),
        ],
      ],
      socialMedia: [
        "",
        [
          Validators.required,
          Validators.pattern(/^https:\/\/(www\.)?instagram\.com\/[\w.-]+$/),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.store.dispatch(getUserInformation());
    this.companyUser$
      .pipe(
        filter((response): response is CompanyUser => !!response),
        tap((data: CompanyUser) => {
          this.initialData = data;
          this.patchFormValues(data);
          this.isLoading$.next(false);
        }),
      )
      .subscribe();
  }

  patchFormValues(data: CompanyUser): void {
    this.companyForm.patchValue({
      phoneNumber: data.phoneNumber ?? "",
      websiteUrl: data.websiteUrl ?? "",
      socialMedia: data.socialMedia?.[0] ?? "",
    });
  }

  onSave(): void {
    const formData = this.companyForm.value;
    const updatedData: UpdateCompanyUser = {
      phoneNumber: formData.phoneNumber,
      websiteUrl: formData.websiteUrl,
      socialMedia: [formData.socialMedia],
    };

    this.store.dispatch(updateUserInformation({ updatedData }));
    this.closeEditor.emit();
  }

  onCancel(): void {
    this.closeEditor.emit();
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
}

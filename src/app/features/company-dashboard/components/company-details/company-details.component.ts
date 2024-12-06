import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { CompanyUser } from "../../models/company-user";
import { getUserInformation } from "../../store/company-profile-actions";
import { selectCompanyUser } from "../../store/company-profile-selectors";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Component({
  selector: "app-company-details",
  templateUrl: "./company-details.component.html",
  styleUrls: ["./company-details.component.scss"],
})
export class CompanyDetailsComponent {
  companyDetails$: Observable<CompanyUser | null>;
  showEditor = false;

  constructor(
    private readonly store: Store,
    private readonly sanitizer: DomSanitizer,
  ) {
    this.companyDetails$ = this.store.select(selectCompanyUser);
    this.store.dispatch(getUserInformation());
  }

  onEdit(): void {
    this.showEditor = true;
  }

  closeEditor(): void {
    this.showEditor = false;
  }

  getSafeImageUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = "none";
    img.parentElement?.classList.add("image-error");
  }
}

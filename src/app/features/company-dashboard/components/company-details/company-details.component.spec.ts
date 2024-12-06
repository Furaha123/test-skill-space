import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { DomSanitizer } from "@angular/platform-browser";
import { CompanyDetailsComponent } from "./company-details.component";
import { CompanyUser } from "../../models/company-user";
import { selectCompanyUser } from "../../store/company-profile-selectors";

describe("CompanyDetailsComponent", () => {
  let component: CompanyDetailsComponent;
  let fixture: ComponentFixture<CompanyDetailsComponent>;
  let store: MockStore;
  let sanitizer: DomSanitizer;

  const initialState = {
    companyProfile: {
      companyUser: {
        name: "TechnoBrains",
        websiteUrl: "ifill-cleaning-solutoins.com",
        socialMedia: ["https://www.linkedin.com/in/furaha"],
        logoUrl: "https://example.com/logo.jpg",
        status: "CREATED",
        registrationDate: "2024-11-30",
        companyAdmin: 4,
        phoneNumber: "+250780163267",
      } as CompanyUser,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyDetailsComponent],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustUrl: jest.fn((url) => url),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyDetailsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    sanitizer = TestBed.inject(DomSanitizer);
    store.overrideSelector(
      selectCompanyUser,
      initialState.companyProfile.companyUser,
    );
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set showEditor to true on edit", () => {
    component.onEdit();

    expect(component.showEditor).toBe(true);
  });

  it("should set showEditor to false on close editor", () => {
    component.showEditor = true;

    component.closeEditor();

    expect(component.showEditor).toBe(false);
  });

  it("should return a safe URL", () => {
    const url = "https://example.com/logo.jpg";
    const safeUrl = component.getSafeImageUrl(url);

    expect(safeUrl).toBe(url);
    expect(sanitizer.bypassSecurityTrustUrl).toHaveBeenCalledWith(url);
  });

  it("should hide image on error", () => {
    const event = {
      target: {
        style: { display: "" },
        parentElement: { classList: { add: jest.fn() } },
      },
    } as unknown as Event;

    component.onImageError(event);

    const img = event.target as HTMLImageElement;
    expect(img.style.display).toBe("none");
    expect(img.parentElement?.classList.add).toHaveBeenCalledWith(
      "image-error",
    );
  });
});

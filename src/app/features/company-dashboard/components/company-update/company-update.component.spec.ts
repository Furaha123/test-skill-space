import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { CompanyUpdateComponent } from "./company-update.component";
import { CompanyUser } from "../../models/company-user";
import { selectCompanyUser } from "../../store/company-profile-selectors";
import { updateUserInformation } from "../../store/company-profile-actions";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CompanyProfileService } from "../../services/company-profile.service";

describe("CompanyUpdateComponent", () => {
  let component: CompanyUpdateComponent;
  let fixture: ComponentFixture<CompanyUpdateComponent>;
  let store: MockStore;
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
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      declarations: [CompanyUpdateComponent],
      providers: [provideMockStore({ initialState }), CompanyProfileService],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyUpdateComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    store.overrideSelector(
      selectCompanyUser,
      initialState.companyProfile.companyUser,
    );
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should populate form with user data", () => {
    component.ngOnInit();
    store.setState({
      companyProfile: {
        companyUser: {
          phoneNumber: "+250780163267",
          websiteUrl: "ifill-cleaning-solutoins.com",
          socialMedia: ["https://www.linkedin.com/in/furaha"],
        } as CompanyUser,
      },
    });

    store.refreshState();
    fixture.detectChanges();

    expect(component.companyForm.get("phoneNumber")?.value).toBe(
      "+250780163267",
    );
    expect(component.companyForm.get("websiteUrl")?.value).toBe(
      "ifill-cleaning-solutoins.com",
    );
    expect(component.companyForm.get("socialMedia")?.value).toBe(
      "https://www.linkedin.com/in/furaha",
    );
  });

  it("should dispatch updateUserInformation action on save", () => {
    jest.spyOn(store, "dispatch");

    component.companyForm.setValue({
      phoneNumber: "+250780163267",
      websiteUrl: "ifill-cleaning-solutoins.com",
      socialMedia: "https://www.linkedin.com/in/furaha",
    });
    const expectedData = {
      phoneNumber: "+250780163267",
      websiteUrl: "ifill-cleaning-solutoins.com",
      socialMedia: ["https://www.linkedin.com/in/furaha"],
    };

    component.onSave();
    expect(store.dispatch).toHaveBeenCalledWith(
      updateUserInformation({ updatedData: expectedData }),
    );
  });

  it("should emit closeEditor event on save", () => {
    jest.spyOn(component.closeEditor, "emit");

    component.companyForm.setValue({
      phoneNumber: "+250780163267",
      websiteUrl: "ifill-cleaning-solutoins.com",
      socialMedia: "https://www.linkedin.com/in/furaha",
    });

    component.onSave();
    expect(component.closeEditor.emit).toHaveBeenCalled();
  });

  it("should emit closeEditor event on cancel", () => {
    jest.spyOn(component.closeEditor, "emit");

    component.onCancel();
    expect(component.closeEditor.emit).toHaveBeenCalled();
  });
});

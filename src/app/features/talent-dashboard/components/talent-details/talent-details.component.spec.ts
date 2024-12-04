import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TalentDetailsComponent } from "./talent-details.component";
import { TalentProfileService } from "../../services/talent-profile.service";
import {
  PersonalDetails,
  ApiResponse,
} from "../../models/personal.detalis.interface";
import { of, throwError } from "rxjs";

describe("TalentDetailsComponent", () => {
  let component: TalentDetailsComponent;
  let fixture: ComponentFixture<TalentDetailsComponent>;
  let httpTestingController: HttpTestingController;
  let mockTalentProfileService: jest.Mocked<TalentProfileService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TalentDetailsComponent],
      providers: [
        {
          provide: TalentProfileService,
          useValue: {
            getPersonalDetails: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TalentDetailsComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    mockTalentProfileService = TestBed.inject(
      TalentProfileService,
    ) as jest.Mocked<TalentProfileService>;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch personal details on init", () => {
    const mockResponse: ApiResponse<PersonalDetails> = {
      status: "Success",
      message: "Got personal Details Successfully",
      data: {
        firstName: "Moses",
        lastName: "Doe",
        introduction:
          "A passionate software developer with over 10 years of experience in full-stack development.",
        birthDate: "1990-05-15",
        nationality: "American",
        currentLocation: "San Francisco, CA, USA",
        phoneNumber: "+1-555-123-4567",
        phoneVisibility: "public",
        socialMedia: [
          { name: "LinkedIn", url: "https://www.linkedin.com/in/johndoe" },
          { name: "GitHub", url: "https://github.com/johndoe" },
          { name: "Twitter", url: "https://twitter.com/johndoe" },
        ],
        profilePictureUrl: "https://example.com/profile-picture.jpg",
        cvUrl: "https://example.com/cv/johndoe.pdf",
        portfolios: [
          "https://portfolio.johndoe.com",
          "https://behance.net/johndoe",
        ],
      },
    };

    mockTalentProfileService.getPersonalDetails.mockReturnValue(
      of(mockResponse),
    );

    component.ngOnInit();

    component.personalDetails$.subscribe((details) => {
      expect(details).toEqual(mockResponse.data);
      expect(component.error).toBe(false);
    });
  });

  it("should handle error when fetching personal details", () => {
    const errorResponse = new Error("Error fetching personal details");

    mockTalentProfileService.getPersonalDetails.mockReturnValue(
      throwError(() => errorResponse),
    );

    component.ngOnInit();

    component.personalDetails$.subscribe({
      next: () => fail("expected an error, not personal details"),
      error: (error) => {
        expect(error).toBe(errorResponse);
        expect(component.error).toBe(true);
      },
    });
  });
});

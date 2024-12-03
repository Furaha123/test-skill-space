import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { TalentEducationComponent } from "./talent-education.component";
import { TalentProfileService } from "../../services/talent-profile.service";
import { EducationRecord } from "../../models/education.record.interface";

describe("TalentEducationComponent", () => {
  let component: TalentEducationComponent;
  let fixture: ComponentFixture<TalentEducationComponent>;
  let mockTalentProfileService: jest.Mocked<TalentProfileService>;

  beforeEach(async () => {
    const talentProfileServiceSpy = {
      getSchools: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [TalentEducationComponent],
      providers: [
        { provide: TalentProfileService, useValue: talentProfileServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TalentEducationComponent);
    component = fixture.componentInstance;
    mockTalentProfileService = TestBed.inject(
      TalentProfileService,
    ) as jest.Mocked<TalentProfileService>;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch education records on init", () => {
    const mockRecords: EducationRecord[] = [
      {
        id: "1",
        name: "Harvard University",
        address: "Massachusetts, USA",
        country: "USA",
        qualificationLevel: "Bachelor's",
        programName: "Computer Science",
        programStatus: "Completed",
        commencementDate: "2005-09-01",
        completionDate: "2009-06-30",
        academicTranscriptUrls: "http://example.com/transcript1",
      },
    ];

    const mockResponse = {
      status: "success",
      message: "Fetched education records successfully",
      data: mockRecords,
    };

    mockTalentProfileService.getSchools.mockReturnValue(of(mockResponse));

    fixture.detectChanges();

    expect(component.educationRecords).toEqual(mockRecords);
    expect(component.isLoading).toBe(false);
    expect(component.error).toBeNull();
  });

  it("should handle error when fetching education records", () => {
    mockTalentProfileService.getSchools.mockReturnValue(
      throwError(() => new Error("Failed to load education records.")),
    );

    fixture.detectChanges();

    expect(component.educationRecords).toEqual([]);
    expect(component.isLoading).toBe(false);
    expect(component.error).toBe("Failed to load education records.");
  });

  it("should start adding a new record", () => {
    component.startAddNewRecord();

    expect(component.mode).toBe("add");
    expect(component.selectedRecord).toEqual({
      id: "",
      name: "",
      address: "",
      country: "",
      qualificationLevel: "",
      programName: "",
      programStatus: "",
      commencementDate: "",
      completionDate: "",
      academicTranscriptUrls: "",
    });
    expect(component.showUpdateComponent).toBe(true);
  });

  it("should start updating an existing record", () => {
    const record: EducationRecord = {
      id: "1",
      name: "Harvard University",
      address: "Massachusetts, USA",
      country: "USA",
      qualificationLevel: "Bachelor's",
      programName: "Computer Science",
      programStatus: "Completed",
      commencementDate: "2005-09-01",
      completionDate: "2009-06-30",
      academicTranscriptUrls: "http://example.com/transcript1",
    };

    component.startUpdate(record);

    expect(component.mode).toBe("update");
    expect(component.selectedRecord).toEqual(record);
    expect(component.showUpdateComponent).toBe(true);
  });

  it("should close update component", () => {
    component.closeUpdateComponent();

    expect(component.showUpdateComponent).toBe(false);
    expect(component.selectedRecord).toBeNull();
  });
});

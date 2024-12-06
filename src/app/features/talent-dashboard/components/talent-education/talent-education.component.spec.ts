import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TalentEducationComponent } from "./talent-education.component";
import { TalentProfileService } from "../../services/talent-profile.service";
import { of, throwError } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { loadEducationRecords } from "../../store/talent.actions";
import { EducationRecord } from "../../models/education.record.interface";

describe("TalentEducationComponent", () => {
  let component: TalentEducationComponent;
  let fixture: ComponentFixture<TalentEducationComponent>;
  let store: MockStore;
  let talentProfileService: jest.Mocked<TalentProfileService>;
  let toastrService: jest.Mocked<ToastrService>;

  const initialState = {
    educationRecords: [],
    loading: false,
    error: null,
  };

  beforeEach(async () => {
    const talentProfileServiceMock = {
      getSchools: jest.fn(),
      deleteSchool: jest.fn().mockReturnValue(of({ status: "success" })),
    };

    const toastrServiceMock = {
      success: jest.fn(),
      error: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [TalentEducationComponent],
      providers: [
        { provide: TalentProfileService, useValue: talentProfileServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock },
        provideMockStore({ initialState }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TalentEducationComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    talentProfileService = TestBed.inject(
      TalentProfileService,
    ) as jest.Mocked<TalentProfileService>;
    toastrService = TestBed.inject(ToastrService) as jest.Mocked<ToastrService>;

    jest.spyOn(store, "dispatch");
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should dispatch loadEducationRecords on init", () => {
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(loadEducationRecords());
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
      academicTranscriptUrls: [],
    });
    expect(component.showUpdateComponent).toBe(true);
  });

  it("should start updating a record", () => {
    const record: EducationRecord = {
      id: "1",
      name: "Harvard University",
      address: "Cambridge, MA",
      country: "USA",
      qualificationLevel: "Bachelor's",
      programName: "Computer Science",
      programStatus: "Completed",
      commencementDate: "2015-09-01",
      completionDate: "2019-05-15",
      academicTranscriptUrls: ["http://example.com/transcript1"],
    };

    component.startUpdate(record);
    expect(component.mode).toBe("update");
    expect(component.selectedRecord).toEqual(record);
    expect(component.showUpdateComponent).toBe(true);
  });

  it("should close update component", () => {
    component.showUpdateComponent = true;
    component.selectedRecord = {} as EducationRecord;
    component.closeUpdateComponent();
    expect(component.showUpdateComponent).toBe(false);
    expect(component.selectedRecord).toBe(null);
  });

  it("should open delete dialog", () => {
    const record: EducationRecord = {
      id: "1",
      name: "Harvard University",
      address: "Cambridge, MA",
      country: "USA",
      qualificationLevel: "Bachelor's",
      programName: "Computer Science",
      programStatus: "Completed",
      commencementDate: "2015-09-01",
      completionDate: "2019-05-15",
      academicTranscriptUrls: ["http://example.com/transcript1"],
    };

    component.openDeleteDialog(record);
    expect(component.recordToDelete).toEqual(record);
    expect(component.showDeleteDialog).toBe(true);
  });

  it("should close delete dialog", () => {
    component.recordToDelete = {} as EducationRecord;
    component.showDeleteDialog = true;
    component.closeDeleteDialog();
    expect(component.recordToDelete).toBe(null);
    expect(component.showDeleteDialog).toBe(false);
  });

  it("should confirm delete and show success toastr", () => {
    const record: EducationRecord = {
      id: "1",
      name: "Harvard University",
      address: "Cambridge, MA",
      country: "USA",
      qualificationLevel: "Bachelor's",
      programName: "Computer Science",
      programStatus: "Completed",
      commencementDate: "2015-09-01",
      completionDate: "2019-05-15",
      academicTranscriptUrls: ["http://example.com/transcript1"],
    };

    component.recordToDelete = record;
    component.confirmDelete();

    expect(talentProfileService.deleteSchool).toHaveBeenCalledWith(record.id);
    expect(toastrService.success).toHaveBeenCalledWith(
      "Education record deleted successfully",
    );
    expect(store.dispatch).toHaveBeenCalledWith(loadEducationRecords());
  });

  it("should handle delete error and show error toastr", () => {
    const errorResponse = {
      message: "Failed to delete education record",
    };

    talentProfileService.deleteSchool.mockReturnValueOnce(
      throwError({ message: errorResponse.message }),
    );

    const record: EducationRecord = {
      id: "1",
      name: "Harvard University",
      address: "Cambridge, MA",
      country: "USA",
      qualificationLevel: "Bachelor's",
      programName: "Computer Science",
      programStatus: "Completed",
      commencementDate: "2015-09-01",
      completionDate: "2019-05-15",
      academicTranscriptUrls: ["http://example.com/transcript1"],
    };

    component.recordToDelete = record;
    component.confirmDelete();

    expect(toastrService.error).toHaveBeenCalledWith(errorResponse.message);
  });
});

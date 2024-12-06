import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { AddJobFormComponent } from "./add-job-form.component";
import { JobPostingService } from "../../../services/job-posting.service";
import { of, throwError } from "rxjs";
import {
  DropdownOption,
  IJobForm,
} from "../../../models/add-job-form.interface";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import {
  ElementRef,
  TemplateRef,
  EmbeddedViewRef,
  ViewRef,
} from "@angular/core";

interface DialogData {
  formData: IJobForm;
  selectedSkills: string[];
}

class MockEmbeddedViewRef implements EmbeddedViewRef<DialogData> {
  destroy(): void {}
  get destroyed(): boolean {
    return false;
  }
  onDestroy(callback: () => void): void {
    if (callback) {
      callback();
    }
  }
  context: DialogData = { formData: {} as IJobForm, selectedSkills: [] };
  rootNodes: Node[] = [];
  get length(): number {
    return 0;
  }
  indexOf(viewRef: ViewRef): number {
    return this.rootNodes.indexOf(viewRef as unknown as Node);
  }
  remove(index?: number): void {
    if (typeof index === "number") {
      this.rootNodes.splice(index, 1);
    }
  }
  detach(): void {}
  insert(viewRef: ViewRef, index?: number): ViewRef {
    if (typeof index === "number") {
      this.rootNodes.splice(index, 0, viewRef as unknown as Node);
    }
    return viewRef;
  }
  move(viewRef: ViewRef, currentIndex: number): ViewRef {
    const oldIndex = this.indexOf(viewRef);
    if (oldIndex > -1 && typeof currentIndex === "number") {
      this.rootNodes.splice(oldIndex, 1);
      this.rootNodes.splice(currentIndex, 0, viewRef as unknown as Node);
    }
    return viewRef;
  }
  get(index: number): ViewRef | null {
    if (typeof index === "number" && index < this.rootNodes.length) {
      return this.rootNodes[index] as unknown as ViewRef;
    }
    return null;
  }
  get first(): ViewRef | null {
    return this.get(0);
  }
  get last(): ViewRef | null {
    return this.get(this.rootNodes.length - 1);
  }
  clear(): void {
    this.rootNodes = [];
  }
  markForCheck(): void {}
  detectChanges(): void {}
  checkNoChanges(): void {}
  reattach(): void {}
}

class MockTemplateRef extends TemplateRef<DialogData> {
  override createEmbeddedView(
    context: DialogData,
  ): EmbeddedViewRef<DialogData> {
    const view = new MockEmbeddedViewRef();
    view.context = context;
    return view;
  }
  get elementRef(): ElementRef<Node> {
    return new ElementRef(document.createElement("div"));
  }
}

describe("AddJobFormComponent", () => {
  let component: AddJobFormComponent;
  let fixture: ComponentFixture<AddJobFormComponent>;
  let jobService: jest.Mocked<JobPostingService>;
  let dialog: jest.Mocked<MatDialog>;
  let addEventListenerSpy: jest.SpyInstance;

  const mockDropdownOptions: DropdownOption[] = [
    { value: "REMOTE", viewValue: "Remote" },
    { value: "ONSITE", viewValue: "On-site" },
  ];

  const mockFormData: IJobForm = {
    title: "Software Engineer",
    company: "Tech Corp",
    workplaceType: "Remote",
    location: "New York",
    jobType: "FULL-TIME",
    salaryRange: "50000-80000",
    deadline: "2024-12-31",
    description: "Test description",
    degree: "Bachelor",
    idealAnswer: "Computer Science",
    experience: "2 years",
    idealExperience: "4 years",
    isQualificationRequired: true,
    mustHaveDegree: true,
    isExperienceRequired: true,
    mustHaveExperience: false,
    skills: ["JavaScript", "TypeScript"],
  };

  beforeEach(async () => {
    const jobServiceMock = {
      getWorkplaceTypes: jest.fn().mockReturnValue(of(mockDropdownOptions)),
      getJobTypes: jest.fn().mockReturnValue(of(mockDropdownOptions)),
      createJob: jest.fn().mockReturnValue(of({})),
    };

    const dialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: () => of("New Skill"),
      }),
    };

    await TestBed.configureTestingModule({
      declarations: [AddJobFormComponent],
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        BrowserDynamicTestingModule,
      ],
      providers: [
        FormBuilder,
        { provide: JobPostingService, useValue: jobServiceMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    }).compileComponents();

    jobService = TestBed.inject(
      JobPostingService,
    ) as jest.Mocked<JobPostingService>;
    dialog = TestBed.inject(MatDialog) as jest.Mocked<MatDialog>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddJobFormComponent);
    component = fixture.componentInstance;

    const mockElement = {
      innerHTML: "",
      focus: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      querySelector: jest.fn(),
    };

    addEventListenerSpy = jest.spyOn(mockElement, "addEventListener");

    component.editor = {
      nativeElement: mockElement,
    } as unknown as ElementRef;

    component.addSkillDialog = new MockTemplateRef();
    component.previewDialog = new MockTemplateRef();

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Initialization", () => {
    it("should initialize the form correctly", () => {
      expect(component.jobForm).toBeTruthy();
      expect(component.jobForm.get("title")?.value).toBe("");
      expect(component.jobForm.get("company")?.value).toBe("");
      expect(component.selectedSkills).toEqual([]);
    });

    it("should load dropdown data on init", () => {
      component.ngOnInit();
      expect(jobService.getWorkplaceTypes).toHaveBeenCalled();
      expect(jobService.getJobTypes).toHaveBeenCalled();
      expect(component.workplaceTypes).toEqual(mockDropdownOptions);
      expect(component.jobTypes).toEqual(mockDropdownOptions);
    });

    it("should set up editor event listeners", () => {
      component.ngOnInit();
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "input",
        expect.any(Function),
      );
    });
  });

  describe("Skills Management", () => {
    it("should add skill on Enter key", () => {
      const event = new KeyboardEvent("keydown", { key: "Enter" });
      component.onSelectSkill("JavaScript", event);
      expect(component.selectedSkills).toContain("JavaScript");
    });

    it("should add skill on mouse event", () => {
      const event = new MouseEvent("click");
      component.onSelectSkill("TypeScript", event);
      expect(component.selectedSkills).toContain("TypeScript");
    });

    it("should remove skill if already selected", () => {
      component.selectedSkills = ["JavaScript"];
      const event = new MouseEvent("click");
      component.onSelectSkill("JavaScript", event);
      expect(component.selectedSkills).not.toContain("JavaScript");
    });

    it("should limit skills to 5", () => {
      component.selectedSkills = ["1", "2", "3", "4", "5"];
      const event = new MouseEvent("click");
      component.onSelectSkill("6", event);
      expect(component.selectedSkills.length).toBe(5);
    });

    it("should handle skill removal", () => {
      component.selectedSkills = ["JavaScript", "TypeScript"];
      const initialLength = component.selectedSkills.length;
      component.onSelectSkill("JavaScript", new MouseEvent("click"));
      expect(component.selectedSkills.length).toBe(initialLength - 1);
      expect(component.selectedSkills).not.toContain("JavaScript");
    });
  });

  describe("Dialog Handling", () => {
    it("should open add skill dialog", fakeAsync(() => {
      component.openAddSkillDialog();
      tick();
      expect(dialog.open).toHaveBeenCalled();
      expect(dialog.open).toHaveBeenCalledWith(
        component.addSkillDialog,
        expect.any(Object),
      );
    }));

    it("should open preview dialog with form data", () => {
      component.jobForm.patchValue(mockFormData);
      component.selectedSkills = mockFormData.skills || [];
      component.onPreview();
      expect(dialog.open).toHaveBeenCalledWith(
        component.previewDialog,
        expect.objectContaining({
          width: "80%",
          maxWidth: "1200px",
          data: {
            formData: expect.any(Object),
            selectedSkills: expect.any(Array),
          },
        }),
      );
    });

    it("should add new skill from dialog", fakeAsync(() => {
      component.openAddSkillDialog();
      tick();
      expect(component.selectedSkills).toContain("New Skill");
    }));
  });

  describe("Form Submission", () => {
    it("should submit valid form", fakeAsync(() => {
      const submitSpy = jest.spyOn(component.submitForm, "emit");
      component.jobForm.patchValue(mockFormData);
      component.selectedSkills = mockFormData.skills || [];

      component.onSubmit();
      tick();

      expect(jobService.createJob).toHaveBeenCalled();
      expect(submitSpy).toHaveBeenCalled();
      expect(component.isLoading).toBeFalsy();
    }));

    it("should handle submission error", fakeAsync(() => {
      const errorMessage = "Submission failed";
      jobService.createJob.mockReturnValueOnce(throwError(() => errorMessage));

      component.jobForm.patchValue(mockFormData);
      component.onSubmit();
      tick();

      expect(component.errorMessage).toBe(errorMessage);
      expect(component.isLoading).toBeFalsy();
    }));

    it("should not submit invalid form", fakeAsync(() => {
      const submitSpy = jest.spyOn(component.submitForm, "emit");
      component.onSubmit();
      tick();
      expect(submitSpy).not.toHaveBeenCalled();
    }));
  });

  describe("Editor Handling", () => {
    it("should handle editor input", () => {
      const content = "New content";
      const event = { target: { innerHTML: content } } as unknown as Event;
      component.onEditorInput(event);
      expect(component.jobForm.get("description")?.value).toBe(content);
    });

    it("should validate editor content on blur", () => {
      component.editor.nativeElement.innerHTML = "";
      component.onEditorBlur();
      expect(component.jobForm.get("description")?.errors).toHaveProperty(
        "required",
      );

      component.editor.nativeElement.innerHTML = "Valid content";
      component.onEditorBlur();
      expect(component.jobForm.get("description")?.errors).toBeNull();
    });
  });

  describe("Form Validation", () => {
    it("should validate required fields", () => {
      const controls = [
        "title",
        "company",
        "workplaceType",
        "location",
        "jobType",
      ];
      controls.forEach((control) => {
        const formControl = component.jobForm.get(control);
        formControl?.markAsTouched();
        expect(component.isFieldInvalid(control)).toBeTruthy();

        formControl?.setValue("Test Value");
        expect(component.isFieldInvalid(control)).toBeFalsy();
      });
    });

    it("should validate salary range format", () => {
      const salaryControl = component.jobForm.get("salaryRange");
      salaryControl?.markAsTouched();

      salaryControl?.setValue("invalid");
      fixture.detectChanges();
      expect(salaryControl?.errors).toBeNull();

      salaryControl?.setValue("50000-80000");
      fixture.detectChanges();
      expect(salaryControl?.errors).toBeNull();
    });
  });

  describe("Navigation and Cleanup", () => {
    it("should emit close event", () => {
      const closeSpy = jest.spyOn(component.closeForm, "emit");
      component.onBack();
      expect(closeSpy).toHaveBeenCalled();
    });
  });
});

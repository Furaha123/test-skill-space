import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  TemplateRef,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import {
  DropdownOption,
  IJobForm,
} from "../../../models/add-job-form.interface";
import { JobPostingService } from "../../../services/job-posting.service";

interface DialogData {
  formData: IJobForm;
  selectedSkills: string[];
}

@Component({
  selector: "app-add-job-form",
  templateUrl: "./add-job-form.component.html",
  styleUrls: ["./add-job-form.component.scss"],
})
export class AddJobFormComponent implements OnInit {
  removeSkill() {
    throw new Error("Method not implemented.");
  }
  @Output() closeForm = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<IJobForm>();
  @ViewChild("editor") editor!: ElementRef;
  @ViewChild("addSkillDialog") addSkillDialog!: TemplateRef<DialogData>;
  @ViewChild("previewDialog") previewDialog!: TemplateRef<DialogData>;

  private destroy$ = new Subject<void>();
  jobForm!: FormGroup;
  selectedSkills: string[] = [];
  newSkill = "";
  isLoading = false;
  errorMessage = "";

  workplaceTypes: DropdownOption[] = [];
  jobTypes: DropdownOption[] = [];

  readonly presetSkills = [
    "Skill 1",
    "Skill 2",
    "Skill 3",
    "Skill 4",
    "Skill 5",
    "Skill 6",
    "Skill 7",
    "Skill 8",
    "Skill 9",
    "Skill 10",
    "Skill 11",
  ];
  storedHandler = "";

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private jobService: JobPostingService,
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.setupEditor();
    this.loadDropdownData();
  }

  private loadDropdownData(): void {
    this.jobService
      .getWorkplaceTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (types) => (this.workplaceTypes = types),
        error: (error) => (this.errorMessage = error),
      });

    this.jobService
      .getJobTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (types) => (this.jobTypes = types),
        error: (error) => (this.errorMessage = error),
      });
  }

  private initializeForm(): void {
    this.jobForm = this.fb.group({
      title: ["", Validators.required],
      company: ["", Validators.required],
      workplaceType: ["", Validators.required],
      location: ["", Validators.required],
      jobType: ["", Validators.required],
      salaryRange: ["", Validators.required],
      deadline: ["", Validators.required],
      description: ["", Validators.required],
      degree: ["", Validators.required],
      idealAnswer: [""],
      experience: ["", Validators.required],
      idealExperience: [""],
      mustHaveDegree: [false],
      mustHaveExperience: [false],
      isQualificationRequired: [false],
      isExperienceRequired: [false],
    });
  }

  private setupEditor(): void {
    if (this.editor) {
      this.editor.nativeElement.innerHTML =
        this.jobForm.get("description")?.value || "";
      this.editor.nativeElement.addEventListener(
        "input",
        this.handleEditorInput,
      );
    }
  }

  private handleEditorInput = () => {
    const content = this.editor.nativeElement.innerHTML;
    this.jobForm.patchValue(
      {
        description: content,
      },
      { emitEvent: true },
    );
  };

  onSelectSkill(skill: string, event: KeyboardEvent | MouseEvent): void {
    if (
      event instanceof KeyboardEvent &&
      event.key !== "Enter" &&
      event.key !== " "
    ) {
      return;
    }

    if (this.selectedSkills.includes(skill)) {
      this.selectedSkills = this.selectedSkills.filter((s) => s !== skill);
    } else if (this.selectedSkills.length < 5) {
      this.selectedSkills.push(skill);
    }
  }

  openAddSkillDialog(): void {
    const dialogRef = this.dialog.open(this.addSkillDialog, {
      width: "400px",
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result && this.selectedSkills.length < 5) {
          this.selectedSkills.push(result);
          this.newSkill = "";
        }
      });
  }

  onPreview(): void {
    this.dialog.open(this.previewDialog, {
      width: "80%",
      maxWidth: "1200px",
      data: {
        formData: this.jobForm.value,
        selectedSkills: this.selectedSkills,
      },
    });
  }

  onSubmit(): void {
    if (this.jobForm.valid) {
      const formData: IJobForm = {
        ...this.jobForm.value,
        description: this.editor?.nativeElement.innerHTML || "",
        skills: this.selectedSkills,
      };

      this.isLoading = true;
      this.jobService
        .createJob(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.submitForm.emit(formData);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error;
          },
        });
    } else {
      this.markFormGroupTouched(this.jobForm);
    }
  }

  onEditorInput(event: Event): void {
    const content = (event.target as HTMLDivElement).innerHTML;
    this.jobForm.patchValue(
      {
        description: content,
      },
      { emitEvent: true },
    );
  }

  onEditorBlur(): void {
    const content = this.editor?.nativeElement.innerHTML;
    this.jobForm.get("description")?.markAsTouched();

    if (!content.trim()) {
      this.jobForm.get("description")?.setErrors({ required: true });
    } else {
      this.jobForm.get("description")?.setErrors(null);
    }
  }

  formatText(command: string): void {
    document.execCommand(command, false);
    if (this.editor) {
      this.editor.nativeElement.focus();
      const content = this.editor.nativeElement.innerHTML;
      this.jobForm.patchValue(
        {
          description: content,
        },
        { emitEvent: true },
      );
    }
  }

  onBack(): void {
    this.closeForm.emit();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.jobForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  validateForm(): boolean {
    if (this.jobForm.invalid) {
      this.markFormGroupTouched(this.jobForm);
      return false;
    }
    return true;
  }
}

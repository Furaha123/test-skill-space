import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import {
  JobPostingData,
  IJobForm,
  DropdownOption,
} from "../models/add-job-form.interface";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class JobPostingService {
  private readonly BASE_URL = environment.apiUrl;
  private jobsSubject = new BehaviorSubject<JobPostingData[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  jobs$ = this.jobsSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get all jobs
  loadJobs(): void {
    this.loadingSubject.next(true);
    this.http
      .get<JobPostingData[]>(`${this.BASE_URL}/companys/company/job-posts`)
      .pipe(catchError(this.handleError.bind(this)))
      .subscribe({
        next: (jobs) => {
          this.jobsSubject.next(jobs);
          this.loadingSubject.next(false);
        },
        error: (error) => {
          this.errorSubject.next(error);
          this.loadingSubject.next(false);
        },
      });
  }

  // Create new job
  createJob(jobForm: IJobForm): Observable<JobPostingData> {
    return this.http
      .post<JobPostingData>(`${this.BASE_URL}/companys/job-posts`, jobForm)
      .pipe(
        tap((newJob) => {
          const currentJobs = this.jobsSubject.value;
          this.jobsSubject.next([...currentJobs, newJob]);
        }),
        catchError(this.handleError.bind(this)),
      );
  }

  // Delete job
  deleteJob(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.BASE_URL}/companys/company/job-posts/${id}`)
      .pipe(
        tap(() => {
          const currentJobs = this.jobsSubject.value;
          this.jobsSubject.next(currentJobs.filter((job) => job.id !== id));
        }),
        catchError(this.handleError.bind(this)),
      );
  }

  // Get workplace types
  getWorkplaceTypes(): Observable<DropdownOption[]> {
    return this.http
      .get<DropdownOption[]>(`${this.BASE_URL}/companys/workspace-types`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  // Get job types
  getJobTypes(): Observable<DropdownOption[]> {
    return this.http
      .get<DropdownOption[]>(`${this.BASE_URL}/companys/job-types`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = "An error occurred";
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 0:
          errorMessage =
            "Unable to connect to the server. Please check your internet connection.";
          break;
        case 400:
          errorMessage = error.error.message || "Invalid request";
          break;
        case 404:
          errorMessage = "Resource not found.";
          break;
        case 500:
          errorMessage = "Internal server error. Please try again later.";
          break;
        default:
          errorMessage = `Server error: ${error.error?.message || error.statusText}`;
      }
    }
    return throwError(() => errorMessage);
  }
}

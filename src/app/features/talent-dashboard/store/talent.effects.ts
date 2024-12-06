import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, tap } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { TalentProfileService } from "../services/talent-profile.service";
import {
  addEducationRecord,
  addEducationRecordFailure,
  addEducationRecordSuccess,
  loadEducationRecords,
  loadEducationRecordsFailure,
  loadEducationRecordsSuccess,
  setEducationRecords,
} from "./talent.actions";
import { of } from "rxjs";
import { EducationRecord } from "../models/education.record.interface";

@Injectable()
export class EducationEffects {
  private readonly STORAGE_KEY = "educationRecords";

  loadEducationRecords$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadEducationRecords),
      mergeMap(() => {
        // First try to get data from localStorage
        const storedRecords = localStorage.getItem(this.STORAGE_KEY);
        if (storedRecords) {
          const records = JSON.parse(storedRecords);
          return of(
            loadEducationRecordsSuccess({ educationRecords: records }),
            setEducationRecords({ educationRecords: records }),
          );
        }

        // If no stored data, fetch from API
        return this.talentProfileService.getSchools().pipe(
          mergeMap((response) => {
            const records = response.data;
            // Store in localStorage
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));

            return [
              loadEducationRecordsSuccess({ educationRecords: records }),
              setEducationRecords({ educationRecords: records }),
            ];
          }),
          catchError((err) => [
            loadEducationRecordsFailure({ error: err.message }),
          ]),
        );
      }),
    ),
  );

  addEducationRecord$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addEducationRecord),
      mergeMap((action) =>
        this.talentProfileService.createSchools(action.educationRecord).pipe(
          map((response) => {
            const storedRecords = localStorage.getItem(this.STORAGE_KEY);
            const currentRecords = storedRecords
              ? JSON.parse(storedRecords)
              : [];
            const updatedRecords = [...currentRecords, response.data];
            localStorage.setItem(
              this.STORAGE_KEY,
              JSON.stringify(updatedRecords),
            );

            return addEducationRecordSuccess({
              educationRecord: response.data,
            });
          }),
          tap(() => {
            this.toastr.success(
              "Education record added successfully",
              "Success",
            );
          }),
          catchError((err) => {
            this.toastr.error(err.message, "Error");
            return [addEducationRecordFailure({ error: err.message })];
          }),
        ),
      ),
    ),
  );

  setEducationRecords$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setEducationRecords),
        tap(({ educationRecords }) => {
          localStorage.setItem(
            this.STORAGE_KEY,
            JSON.stringify(educationRecords),
          );
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly talentProfileService: TalentProfileService,
    private readonly toastr: ToastrService,
  ) {}

  // Helper method for localStorage operations
  private getStoredRecords(): EducationRecord[] {
    const records = localStorage.getItem(this.STORAGE_KEY);
    return records ? JSON.parse(records) : [];
  }

  private updateStoredRecords(records: EducationRecord[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
  }
}

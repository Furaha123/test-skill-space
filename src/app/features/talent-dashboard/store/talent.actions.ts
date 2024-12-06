import { createAction, props } from "@ngrx/store";
import { EducationRecord } from "../models/education.record.interface";

export const loadEducationRecords = createAction(
  "[Education] Load Education Records",
);

export const loadEducationRecordsSuccess = createAction(
  "[Education] Load Education Records Success",
  props<{ educationRecords: EducationRecord[] }>(),
);

export const loadEducationRecordsFailure = createAction(
  "[Education] Load Education Records Failure",
  props<{ error: string }>(),
);

export const addEducationRecord = createAction(
  "[Education] Add Education Record",
  props<{ educationRecord: EducationRecord }>(),
);

export const addEducationRecordSuccess = createAction(
  "[Education] Add Education Record Success",
  props<{ educationRecord: EducationRecord }>(),
);

export const addEducationRecordFailure = createAction(
  "[Education] Add Education Record Failure",
  props<{ error: string }>(),
);
export const updateEducationRecord = createAction(
  "[Education] Update Education Record",
  props<{ id: string; educationRecord: EducationRecord }>(),
);

export const updateEducationRecordSuccess = createAction(
  "[Education] Update Education Record Success",
  props<{ id: string; educationRecord: EducationRecord }>(), // Add id here
);

export const updateEducationRecordFailure = createAction(
  "[Education] Update Education Record Failure",
  props<{ error: string }>(),
);

export const deleteEducationRecord = createAction(
  "[Education] Delete Education Record",
  props<{ id: string; educationRecord: EducationRecord }>(),
);

export const deleteEducationRecordSuccess = createAction(
  "[Education] Delete Education Record Success",
  props<{ id: string; educationRecord: EducationRecord }>(),
);

export const deleteEducationRecordFailure = createAction(
  "[Education] Delete Education Record Failure",
  props<{ error: string; educationRecord: EducationRecord }>(),
);
export const setEducationRecords = createAction(
  "[Education] Set Education Records",
  props<{ educationRecords: EducationRecord[] }>(),
);

import { createReducer, on } from "@ngrx/store";
import { EducationRecord } from "../models/education.record.interface";
import {
  addEducationRecord,
  addEducationRecordFailure,
  addEducationRecordSuccess,
  deleteEducationRecord,
  deleteEducationRecordFailure,
  deleteEducationRecordSuccess,
  loadEducationRecords,
  loadEducationRecordsFailure,
  loadEducationRecordsSuccess,
  setEducationRecords,
  updateEducationRecord,
  updateEducationRecordFailure,
  updateEducationRecordSuccess,
} from "./talent.actions";

export interface EducationState {
  educationRecords: EducationRecord[];
  error: string | null;
  isLoading: boolean;
}

export const initialState: EducationState = {
  educationRecords: [],
  error: null,
  isLoading: false,
};

export const educationReducer = createReducer(
  initialState,

  // Load Education Records
  on(loadEducationRecords, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(loadEducationRecordsSuccess, (state, { educationRecords }) => ({
    ...state,
    educationRecords,
    isLoading: false,
    error: null,
  })),
  on(loadEducationRecordsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Add Education Record
  on(addEducationRecord, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(addEducationRecordSuccess, (state, { educationRecord }) => ({
    ...state,
    educationRecords: [...state.educationRecords, educationRecord],
    isLoading: false,
    error: null,
  })),
  on(addEducationRecordFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Update Education Record
  on(updateEducationRecord, (state, { id, educationRecord }) => ({
    ...state,
    educationRecords: state.educationRecords.map((record) =>
      record.id === id ? educationRecord : record,
    ),

    error: null,
  })),
  on(updateEducationRecordSuccess, (state, { id, educationRecord }) => ({
    ...state,
    educationRecords: state.educationRecords.map((record) =>
      record.id === id ? educationRecord : record,
    ),

    error: null,
  })),
  on(updateEducationRecordFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Delete Education Record
  on(deleteEducationRecord, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(deleteEducationRecordSuccess, (state, { id }) => ({
    ...state,
    educationRecords: state.educationRecords.filter(
      (record) => record.id !== id,
    ),
    isLoading: false,
    error: null,
  })),
  on(deleteEducationRecordFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Set Education Records
  on(setEducationRecords, (state, { educationRecords }) => ({
    ...state,
    educationRecords,
  })),
);

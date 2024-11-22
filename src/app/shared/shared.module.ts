import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LayoutComponent } from "./layout/layout.component";
import { InputComponent } from "./components/input/input.component";
import { ErrorToastComponent } from "./components/error-toast/error-toast.component";
import { ButtonComponent } from "./components/button/button.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { CountryCodesComponent } from "./components/country-codes/country-codes.component";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { AuthLayoutComponent } from "./auth-layout/auth-layout.component";

@NgModule({
  declarations: [
    LayoutComponent,
    InputComponent,
    ErrorToastComponent,
    ButtonComponent,
    CountryCodesComponent,
    LoaderComponent,
    CalendarComponent,
    AuthLayoutComponent,
  ],

  imports: [CommonModule, MatProgressSpinnerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  exports: [
    LayoutComponent,
    InputComponent,
    ButtonComponent,
    LoaderComponent,
    ErrorToastComponent,
    CountryCodesComponent,
    CalendarComponent,
    AuthLayoutComponent,
  ],
})
export class SharedModule {}

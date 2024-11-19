import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedRoutingModule } from "./shared-routing.module";
import { SharedComponent } from "./shared.component";
import { LayoutComponent } from "./layout/layout.component";
import { InputComponent } from "./components/input/input.component";
import { ErrorToastComponent } from "./components/error-toast/error-toast.component";
import { ButtonComponent } from "./components/button/button.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { CountryCodesComponent } from "./components/country-codes/country-codes.component";

@NgModule({
  declarations: [
    SharedComponent,
    LayoutComponent,
    InputComponent,
    ErrorToastComponent,
    ButtonComponent,
    CountryCodesComponent,
    LoaderComponent,
  ],

  imports: [CommonModule, SharedRoutingModule, MatProgressSpinnerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  exports: [
    SharedComponent,
    LayoutComponent,
    InputComponent,
    ButtonComponent,
    LoaderComponent,
    ErrorToastComponent,
    CountryCodesComponent,
  ],
})
export class SharedModule {}

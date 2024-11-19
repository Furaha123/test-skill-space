import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedRoutingModule } from "./shared-routing.module";
import { SharedComponent } from "./shared.component";
import { LayoutComponent } from "./layout/layout.component";
import { InputComponent } from "./components/input/input.component";
import { ErrorToastComponent } from "./components/error-toast/error-toast.component";
import { ButtonComponent } from "./components/button/button.component";

import { NgxCountriesDropdownModule } from "ngx-countries-dropdown";
import { CountryCodesComponent } from "./components/country-codes/country-codes.component";

@NgModule({
  declarations: [
    SharedComponent,
    LayoutComponent,
    InputComponent,
    ErrorToastComponent,
    ButtonComponent,
    CountryCodesComponent,
  ],
  exports: [
    SharedComponent,
    LayoutComponent,
    InputComponent,
    ButtonComponent,
    CountryCodesComponent,
  ],
  imports: [CommonModule, SharedRoutingModule, NgxCountriesDropdownModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}

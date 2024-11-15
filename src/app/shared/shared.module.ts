import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedRoutingModule } from "./shared-routing.module";
import { SharedComponent } from "./shared.component";
import { LayoutComponent } from "./layout/layout.component";
import { InputComponent } from "./components/input/input.component";
import { ErrorToastComponent } from "./components/error-toast/error-toast.component";
import { ButtonComponent } from "./components/button/button.component";

@NgModule({
  declarations: [
    SharedComponent,
    LayoutComponent,
    InputComponent,
    ErrorToastComponent,
    ButtonComponent,
  ],
  imports: [CommonModule, SharedRoutingModule],
  exports: [SharedComponent, LayoutComponent, InputComponent, ButtonComponent],
})
export class SharedModule {}

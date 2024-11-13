import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedRoutingModule } from "./shared-routing.module";
import { SharedComponent } from "./shared.component";
import { LayoutComponent } from "./layout/layout.component";

@NgModule({
  declarations: [SharedComponent, LayoutComponent],
  imports: [CommonModule, SharedRoutingModule],
  exports: [SharedComponent, LayoutComponent],
})
export class SharedModule {}

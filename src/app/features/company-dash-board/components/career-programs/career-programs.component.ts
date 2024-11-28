import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-career-programs",
  templateUrl: "./career-programs.component.html",
  styleUrl: "./career-programs.component.scss",
})
export class CareerProgramsComponent {
  selectedTabIndex = 0;

  constructor(private readonly router: Router) {}

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }
  onAddProgram() {
    this.router.navigateByUrl("company/program/edit");
  }
}

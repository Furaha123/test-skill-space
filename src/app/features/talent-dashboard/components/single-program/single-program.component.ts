import { Component } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-single-program",
  templateUrl: "./single-program.component.html",
  styleUrl: "./single-program.component.scss",
})
export class SingleProgramComponent {
  constructor(
    private location: Location,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  goBack(): void {
    this.location.back();
  }

  onApply() {
    this.router.navigate(["apply"], { relativeTo: this.route });
  }
}

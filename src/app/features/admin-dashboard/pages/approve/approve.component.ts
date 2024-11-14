import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-approve",
  templateUrl: "./approve.component.html",
  styleUrl: "./approve.component.scss",
})
export class ApproveComponent {
  constructor(private readonly router: Router) {}
  headBack() {
    this.router.navigate(["admin-dashboard", "company-approval"]);
  }
}

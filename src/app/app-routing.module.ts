import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ROUTE_PATHS } from "./app.routes";

const routes: Routes = [
  {
    path: ROUTE_PATHS.auth,
    loadChildren: async () =>
      (await import("./authentication/authentication.module"))
        .AuthenticationModule,
  },
  {
    path: ROUTE_PATHS["admin-dashboard"],
    loadChildren: async () =>
      (await import("./features/admin-dashboard/admin-dashboard.module"))
        .AdminDashboardModule,
  },
  {
    path: "company",
    loadChildren: () =>
      import("./features/company-dashboard/company-dashboard.module").then(
        (m) => m.CompanyDashboardModule,
      ),
  },
  {
    path: "",
    redirectTo: ROUTE_PATHS["talent"],
    pathMatch: "full",
  },
  {
    path: "talent",
    loadChildren: () =>
      import("./features/talent-dashboard/talent-dashboard.module").then(
        (m) => m.TalentDashboardModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

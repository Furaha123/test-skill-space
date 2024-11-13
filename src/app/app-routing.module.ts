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
    path: "",
    redirectTo: ROUTE_PATHS["admin-dashboard"],
    pathMatch: "full",
  },
  {
    path: "shared",
    loadChildren: () =>
      import("./shared/shared.module").then((m) => m.SharedModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

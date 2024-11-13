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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

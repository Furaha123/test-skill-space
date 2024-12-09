import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";

type HttpRequestBody = unknown;

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService) {}

  intercept(
    req: HttpRequest<HttpRequestBody>,
    next: HttpHandler,
  ): Observable<HttpEvent<HttpRequestBody>> {
    if (req.url.includes("/auth/reset-password")) {
      const resetToken = localStorage.getItem("reset_token");
      if (resetToken) {
        const clonedReq = req.clone({
          headers: req.headers
            .set("Reset-Token", resetToken)
            .set("Content-Type", "application/json"),
        });
        return next
          .handle(clonedReq)
          .pipe(
            catchError((error: HttpErrorResponse) => this.handleError(error)),
          );
      }
    }

    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      const clonedReq = req.clone({
        headers: req.headers
          .set("Authorization", `Bearer ${authToken}`)
          .set("Content-Type", "application/json"),
      });
      return next
        .handle(clonedReq)
        .pipe(
          catchError((error: HttpErrorResponse) => this.handleError(error)),
        );
    }

    return next
      .handle(req)
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = "An unexpected error occurred";
    let errorTitle = "Error";

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (typeof error.error === "object" && error.error !== null) {
        errorMessage = error.error.message || error.message;

        if (error.url?.includes("reset-password")) {
          switch (error.status) {
            case 400:
              errorTitle = "Password Error";
              break;
            case 401:
              errorTitle = "Invalid Token";
              sessionStorage.removeItem("reset_token");
              break;
            case 403:
              errorTitle = "Token Expired";
              sessionStorage.removeItem("reset_token");
              break;
            case 404:
              errorTitle = "Reset Link Error";
              break;
            default:
              errorTitle = "Password Reset Error";
          }
        }
      } else {
        errorMessage = error.message;
      }
    }

    this.toastr.error(errorMessage, errorTitle);
    return throwError(() => error);
  }
}

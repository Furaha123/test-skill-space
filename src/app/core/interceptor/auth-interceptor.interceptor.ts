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
    const token = sessionStorage.getItem("authToken");

    if (token) {
      const clonedReq = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${token}`),
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
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (typeof error.error === "object" && error.error !== null) {
        errorMessage = error.error.message || error.message;

        // Handle password reset specific errors
        if (error.url?.includes("reset-password")) {
          switch (error.status) {
            case 400:
              errorTitle = "Password Error";
              break;
            case 401:
              errorTitle = "Invalid Request";
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

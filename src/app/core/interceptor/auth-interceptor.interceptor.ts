import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { Observable } from "rxjs";

// Define a type for the possible request/response body types
type HttpRequestBody = unknown;

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<HttpRequestBody>,
    next: HttpHandler,
  ): Observable<HttpEvent<HttpRequestBody>> {
    const token = sessionStorage.getItem("authToken");

    if (token) {
      const clonedReq = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${token}`),
      });
      return next.handle(clonedReq);
    }

    return next.handle(req);
  }
}

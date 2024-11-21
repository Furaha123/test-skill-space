import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import {
  HttpClient,
  HTTP_INTERCEPTORS,
  HttpRequest,
  HttpHandler,
  HttpResponse,
} from "@angular/common/http";
import { AuthInterceptor } from "./auth-interceptor.interceptor";
import { of } from "rxjs";

type HttpRequestBody = Record<string, unknown>;
type HttpResponseBody = Record<string, unknown>;

describe("AuthInterceptor", () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  const mockToken = "mock-jwt-token";
  const testUrl = "/api/test";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthInterceptor, // Explicitly provide the AuthInterceptor itself
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true, // Register it as an interceptor
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no unmatched requests
    sessionStorage.clear(); // Clear sessionStorage after each test
  });

  it("should be created", () => {
    const interceptor = TestBed.inject(AuthInterceptor); // Explicitly test the interceptor
    expect(interceptor).toBeTruthy();
  });

  it("should add Authorization header if token exists in sessionStorage", () => {
    sessionStorage.setItem("authToken", mockToken);

    httpClient.get(testUrl).subscribe();

    const req = httpMock.expectOne(testUrl);
    expect(req.request.headers.has("Authorization")).toBeTruthy();
    expect(req.request.headers.get("Authorization")).toBe(
      `Bearer ${mockToken}`,
    );
    req.flush({}); // Simulate successful backend response
  });

  it("should not add Authorization header if token does not exist", () => {
    httpClient.get(testUrl).subscribe();

    const req = httpMock.expectOne(testUrl);
    expect(req.request.headers.has("Authorization")).toBeFalsy();
    req.flush({}); // Simulate successful backend response
  });

  it("should clone the request with Authorization header when token exists", () => {
    sessionStorage.setItem("authToken", mockToken);

    const handler: HttpHandler = {
      handle: jest.fn((req: HttpRequest<HttpRequestBody>) => {
        // Return a mock Observable<HttpEvent<HttpResponseBody>>
        expect(req.headers.get("Authorization")).toBe(`Bearer ${mockToken}`);
        return of(
          new HttpResponse<HttpResponseBody>({ status: 200, body: {} }),
        );
      }),
    };

    const interceptor = new AuthInterceptor();
    const request = new HttpRequest<HttpRequestBody>("GET", testUrl);

    interceptor.intercept(request, handler).subscribe();
    expect(handler.handle).toHaveBeenCalledTimes(1);
  });

  it("should pass the request as is if token does not exist", () => {
    const handler: HttpHandler = {
      handle: jest.fn((req: HttpRequest<HttpRequestBody>) => {
        // Return a mock Observable<HttpEvent<HttpResponseBody>>
        expect(req.headers.has("Authorization")).toBeFalsy();
        return of(
          new HttpResponse<HttpResponseBody>({ status: 200, body: {} }),
        );
      }),
    };

    const interceptor = new AuthInterceptor();
    const request = new HttpRequest<HttpRequestBody>("GET", testUrl);

    interceptor.intercept(request, handler).subscribe();
    expect(handler.handle).toHaveBeenCalledTimes(1);
  });
});

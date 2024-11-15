import { TestBed, ComponentFixture } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { StoreModule, Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";
import { AuthState } from "../../auth-store/auth.reducer";
import * as AuthActions from "../../auth-store/auth.actions";
import { LoginComponent } from "./login.component";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: Store<{ auth: AuthState }>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        StoreModule.forRoot({}),
        RouterTestingModule,
      ],
      declarations: [LoginComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            select: jest.fn().mockReturnValue(of(null)),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);

    jest.spyOn(router, "navigate");
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize the form with default values", () => {
    const loginForm = component.loginForm;
    expect(loginForm).toBeDefined();
    expect(loginForm.get("email")?.value).toBe("");
    expect(loginForm.get("password")?.value).toBe("");
  });

  it("should initialize showError$ observable", () => {
    const error$ = of("Login error");
    jest.spyOn(store, "select").mockReturnValue(error$);
    component.ngOnInit();
    fixture.detectChanges();
    component.showError$.subscribe((error) => {
      expect(error).toBe("Login error");
    });
  });

  it("should mark form fields as touched on invalid submit", () => {
    component.onSubmit();
    expect(component.loginForm.get("email")?.touched).toBe(true);
    expect(component.loginForm.get("password")?.touched).toBe(true);
  });

  it("should return true if the field is invalid and touched or dirty", () => {
    const control = component.loginForm.get("email");
    control?.markAsTouched();
    control?.setErrors({ required: true });
    expect(component.isFieldInvalid("email")).toBe(true);
  });

  it("should return false if the field is valid or not touched and dirty", () => {
    const control = component.loginForm.get("email");
    control?.markAsUntouched();
    control?.setErrors(null);
    expect(component.isFieldInvalid("email")).toBe(false);
  });

  it("should dispatch login action on valid submit", () => {
    component.loginForm.setValue({
      email: "test@example.com",
      password: "Password123!",
    });
    component.onSubmit();
    expect(store.dispatch).toHaveBeenCalledWith(
      AuthActions.login({
        email: "test@example.com",
        password: "Password123!",
      }),
    );
  });

  it("should navigate to the correct route based on user role", (done) => {
    const roles = ["admin", "talent", "company", "mentor"];
    const paths = [
      "/admin/dashboard",
      "/talent/dashboard",
      "/company/dashboard",
      "/mentor/dashboard",
    ];

    roles.forEach((role, index) => {
      jest.spyOn(store, "select").mockReturnValueOnce(of(role));
      component.loginForm.setValue({
        email: "test@example.com",
        password: "Password123!",
      });
      component.onSubmit();
      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith([paths[index]]);
        done();
      }, 0);
    });
  });

  it("should handle unknown role and navigate to /login", () => {
    jest.spyOn(store, "select").mockReturnValue(of("unknown"));
    component.loginForm.setValue({
      email: "test@example.com",
      password: "Password123!",
    });
    component.onSubmit();
    expect(router.navigate).toHaveBeenCalledWith(["/login"]);
  });

  it("should show error observable", () => {
    const error$ = of("Invalid credentials");
    jest.spyOn(store, "select").mockReturnValueOnce(error$);
    component.ngOnInit();
    component.showError$.subscribe((error) => {
      expect(error).toBe("Invalid credentials");
    });
  });

  it("should not dispatch login action when form is invalid", () => {
    component.loginForm.setValue({ email: "invalid", password: "short" });
    component.onSubmit();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it("should mark all fields as touched if form is invalid on submit", () => {
    component.loginForm.setValue({ email: "", password: "" });
    component.onSubmit();
    expect(component.loginForm.get("email")?.touched).toBe(true);
    expect(component.loginForm.get("password")?.touched).toBe(true);
  });

  it("should handle email validation error correctly", () => {
    component.loginForm.get("email")?.setValue("");
    component.onSubmit();
    expect(component.loginForm.get("email")?.errors?.["required"]).toBeTruthy();
  });

  it("should handle password validation error correctly", () => {
    component.loginForm.get("password")?.setValue("short");
    component.onSubmit();
    expect(
      component.loginForm.get("password")?.errors?.["minlength"],
    ).toBeTruthy();
  });

  it("should validate password pattern", () => {
    component.loginForm.get("password")?.setValue("Password");
    component.onSubmit();
    expect(
      component.loginForm.get("password")?.errors?.["pattern"],
    ).toBeTruthy();
  });
});

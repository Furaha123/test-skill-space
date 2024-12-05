import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { SingleProgramComponent } from "./single-program.component";

describe("SingleProgramComponent", () => {
  let component: SingleProgramComponent;
  let fixture: ComponentFixture<SingleProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleProgramComponent],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

import { CountryCodesComponent } from "./country-codes.component";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed, ComponentFixture } from "@angular/core/testing";
import { CountryApiResponse } from "../models/countrycode.interface";

describe("CountryCodesComponent", () => {
  let component: CountryCodesComponent;
  let fixture: ComponentFixture<CountryCodesComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CountryCodesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CountryCodesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call fetchCountries on ngOnInit", () => {
    jest.spyOn(component, "fetchCountries");
    component.ngOnInit();
    expect(component.fetchCountries).toHaveBeenCalled();

    // Flush the request made by ngOnInit
    const req = httpMock.expectOne("https://restcountries.com/v3.1/all");
    req.flush([]);
  });

  it("should fetch and map countries correctly", () => {
    const mockResponse = [
      {
        idd: { root: "+1", suffixes: ["123"] },
        flags: { svg: "flag-url.svg" },
      },
      {
        idd: { root: "+44", suffixes: ["456"] },
        flags: { svg: "flag-url2.svg" },
      },
    ];

    component.fetchCountries();

    const req = httpMock.expectOne("https://restcountries.com/v3.1/all");
    req.flush(mockResponse);

    expect(component.countries.length).toBe(2);
    expect(component.countries[0].code).toBe("+1123");
    expect(component.countries[0].flag).toBe("flag-url.svg");
    expect(component.countries[1].code).toBe("+44456");
    expect(component.countries[1].flag).toBe("flag-url2.svg");
  });

  it("should handle empty country data correctly", () => {
    const mockResponse: CountryApiResponse[] = [];

    component.fetchCountries();

    const req = httpMock.expectOne("https://restcountries.com/v3.1/all");
    req.flush(mockResponse);

    expect(component.countries.length).toBe(0);
  });

  it("should handle country with missing fields gracefully", () => {
    const mockResponse = [
      {
        idd: { root: "", suffixes: [] },
        flags: { svg: "flag-url.svg" },
      },
      {
        idd: { root: "+44", suffixes: [] },
        flags: { svg: "flag-url2.svg" },
      },
    ];

    component.fetchCountries();

    const req = httpMock.expectOne("https://restcountries.com/v3.1/all");
    req.flush(mockResponse);

    expect(component.countries.length).toBe(1);
    expect(component.countries[0].code).toBe("+44");
    expect(component.countries[0].flag).toBe("flag-url2.svg");
  });

  it("should select the default country Rwanda on fetch", () => {
    const mockResponse = [
      {
        idd: { root: "+250", suffixes: [""] },
        flags: { svg: "flag-url-rwanda.svg" },
      },
      {
        idd: { root: "+1", suffixes: ["123"] },
        flags: { svg: "flag-url.svg" },
      },
    ];

    jest.spyOn(component, "selectCountry");

    component.fetchCountries();

    const req = httpMock.expectOne("https://restcountries.com/v3.1/all");
    req.flush(mockResponse);

    expect(component.selectCountry).toHaveBeenCalledWith({
      code: "+250",
      flag: "flag-url-rwanda.svg",
    });
    expect(component.selectedCountryCode).toBe("+250");
  });

  it("should toggle dropdown state", () => {
    component.toggleDropdown();
    expect(component.isDropdownOpen).toBeTruthy();

    component.toggleDropdown();
    expect(component.isDropdownOpen).toBeFalsy();
  });

  it("should select country and emit event", () => {
    const country = { code: "+1123", flag: "flag-url.svg" };
    jest.spyOn(component.countrySelected, "emit");

    component.selectCountry(country);

    expect(component.selectedCountryCode).toBe(country.code);
    expect(component.selectedFlagUrl).toBe(country.flag);
    expect(component.isDropdownOpen).toBeFalsy();
    expect(component.countrySelected.emit).toHaveBeenCalledWith(country.code);
  });

  afterEach(() => {
    httpMock.verify();
  });
});

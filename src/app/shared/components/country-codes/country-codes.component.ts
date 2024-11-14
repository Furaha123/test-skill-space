import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Country, CountryApiResponse } from "../models/countrycode.interface";

@Component({
  selector: "app-country-codes",
  templateUrl: "./country-codes.component.html",
  styleUrls: ["./country-codes.component.scss"],
})
export class CountryCodesComponent implements OnInit {
  @Output() countrySelected = new EventEmitter<string>();

  countries: Country[] = [];
  selectedCountryCode: string | null = null;
  selectedFlagUrl: string | null = null;
  isDropdownOpen = false;

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCountries();
  }

  fetchCountries(): void {
    const apiUrl = "https://restcountries.com/v3.1/all";
    this.http.get<CountryApiResponse[]>(apiUrl).subscribe((data) => {
      this.countries = data
        .map(
          (country): Country => ({
            code:
              country.idd.root +
              (country.idd.suffixes && country.idd.suffixes.length > 0
                ? country.idd.suffixes[0]
                : ""),
            flag: country.flags.svg,
          }),
        )
        .filter((country) => country.code.trim() !== "");

      const rwanda = this.countries.find((c) => c.code === "+250");
      if (rwanda) {
        this.selectCountry(rwanda);
      }
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectCountry(country: Country): void {
    this.selectedCountryCode = country.code;
    this.selectedFlagUrl = country.flag;
    this.isDropdownOpen = false;
    this.countrySelected.emit(country.code);
  }
}

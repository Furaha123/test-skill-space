import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthServiceService {
  readonly apiUrl = environment.apiUrl;
}

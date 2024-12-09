import { Component, OnInit } from "@angular/core";
import { TalentProfileService } from "../../services/talent-profile.service";
import { PersonalDetails } from "../../models/personal.detalis.interface";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";

@Component({
  selector: "app-talent-details",
  templateUrl: "./talent-details.component.html",
  styleUrls: ["./talent-details.component.scss"],
})
export class TalentDetailsComponent implements OnInit {
  personalDetails$!: Observable<PersonalDetails>;
  error = false;
  isEditing = false;

  constructor(private readonly talentProfileService: TalentProfileService) {}

  ngOnInit(): void {
    this.personalDetails$ = this.talentProfileService.getPersonalDetails().pipe(
      map((response) => response.data),
      catchError((err) => {
        this.error = true;
        throw err;
      }),
    );
  }

  onEdit(): void {
    this.isEditing = true;
  }

  onCancelEdit(): void {
    this.isEditing = false;
  }
}

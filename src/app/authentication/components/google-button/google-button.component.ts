import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { GoogleCredentialResponse } from "../../models/google-auth.model";
import { environment } from "../../../../environments/environment.development";

@Component({
  selector: "app-google-button",
  templateUrl: "./google-button.component.html",
  styleUrl: "./google-button.component.scss",
})
export class GoogleButtonComponent implements OnInit {
  @Input() buttonText = "Sign up with Google";
  @Output() credentialResponse = new EventEmitter<GoogleCredentialResponse>();

  ngOnInit() {
    this.initializeGoogleSignIn();
  }

  private initializeGoogleSignIn() {
    window.google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: GoogleCredentialResponse) => {
        this.credentialResponse.emit(response);
      },
    });

    window.google.accounts.id.renderButton(
      document.querySelector(".btn-google"),
      {
        theme: "outline",
        size: "large",
        width: "100%",
      },
    );
  }
}

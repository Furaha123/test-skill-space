import { Component, Input } from "@angular/core";
import { typeConfigs } from "./error.objects";
import { TypeConfig } from "../../models/typeConfig.interface";

@Component({
  selector: "app-error-toast",
  templateUrl: "./error-toast.component.html",
  styleUrl: "./error-toast.component.scss",
})
export class ErrorToastComponent {
  @Input() title = "";
  @Input() subText = "";
  @Input() type: "warning" | "error" = "warning";

  get currentConfig(): TypeConfig | undefined {
    return typeConfigs[this.type];
  }
}

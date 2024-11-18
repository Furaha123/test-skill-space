import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-button",
  templateUrl: "./button.component.html",
  styleUrl: "./button.component.scss",
})
export class ButtonComponent {
  @Input() text = "Button";
  @Input() type: "submit" | "button" | "reset" = "button";
  @Input() isDisabled = false;
  @Input() isActive = false;
  @Input() customClasses = "";
  @Output() handleClick = new EventEmitter<Event>();
}

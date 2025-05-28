import { Component } from '@angular/core';
import { AppComponent } from "../../app.component";

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [AppComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
}

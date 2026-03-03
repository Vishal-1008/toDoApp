import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AboutComponent } from "../about/about.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink, AboutComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  currentYear: number = new Date().getFullYear();
}

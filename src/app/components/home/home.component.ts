import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AboutComponent } from "../about/about.component";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink, AboutComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private authService: AuthService) {}

  currentYear: number = new Date().getFullYear();

  signInWithGoogle() {
    this.authService.loginWithGoogle();
  }
}

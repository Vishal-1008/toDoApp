import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FeedbackComponent } from "../feedback/feedback.component";

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, CommonModule, FeedbackComponent],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  isMobileNav: boolean = false;
  showMobileFeedbackForm: boolean = false;

  authService = inject(AuthService);

  get isUserLoggedIn() {
    return !!this.authService.user();
  }

  get getLoggedInUserData() {
    return this.authService.user()?.displayName || 'User';
  }

  signInWithGoogle() {
    this.authService.loginWithGoogle();
  }

  logout() {
    this.authService.logout();
  }

  openMobileNav() {
    this.isMobileNav = !this.isMobileNav; 
  }

    openMobileFeedbackForm() {
    this.openMobileNav()
    this.showMobileFeedbackForm = false; // reset first

    setTimeout(() => {
      this.showMobileFeedbackForm = true; // then reopen
    });
  }
}

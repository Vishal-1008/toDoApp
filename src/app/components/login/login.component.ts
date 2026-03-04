import { Component, inject } from '@angular/core';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { auth } from '../../app.config';
import { onAuthStateChanged } from 'firebase/auth';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

export class LoginComponent {
  private authService = inject(AuthService);

  signInWithGoogle() {
    this.authService.loginWithGoogle();
  }

  get getLoggedInUserData() {
    return this.authService.user()?.displayName;
  }
}

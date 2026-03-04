import { Injectable, inject, signal } from '@angular/core';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../app.config';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);

  user = signal<User | null>(null);
  constructor() {
    this.listenToAuthState();
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();

    return signInWithPopup(auth, provider)
      .then((result) => {
        console.log('User:', result.user);
        this.router.navigate(['/add/todo']);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  logout() {
    signOut(auth).then(() => {
      this.router.navigate(['']);
    });
  }

  private listenToAuthState() {
  onAuthStateChanged(auth, (user) => {
    console.log('Auth State Changed:', user);

    this.user.set(user); // This handles both login AND logout
  });
}
}

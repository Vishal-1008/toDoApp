import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { auth } from '../app.config';
import { onAuthStateChanged } from 'firebase/auth';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  return new Promise<boolean>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(true);
      } else {
        router.navigate(['']);
        resolve(false);
      }
    });
  });
};

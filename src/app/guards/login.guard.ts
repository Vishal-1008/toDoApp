import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { auth } from '../app.config';
import { onAuthStateChanged } from 'firebase/auth';

export const loginGuard: CanActivateFn = () => {
  const router = inject(Router);

  return new Promise<boolean>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.navigate(['/add/todo']);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

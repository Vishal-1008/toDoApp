import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import Aura from '@primeng/themes/aura';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyBoSYdACKN5aY2UZQfogMFMdEaojoKM2ow',
  authDomain: 'taskpilot-4a52d.firebaseapp.com',
  projectId: 'taskpilot-4a52d',
  storageBucket: 'taskpilot-4a52d.firebasestorage.app',
  messagingSenderId: '188120541190',
  appId: '1:188120541190:web:4de39ff2358588e511fb87',
  measurementId: 'G-5LFE6ZZHG6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient()
  ],
};

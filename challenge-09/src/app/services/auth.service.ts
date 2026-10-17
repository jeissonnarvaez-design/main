// src/app/services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { auth } from '../firebase/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly currentUser = signal<User | null>(null);

  constructor() {
    onAuthStateChanged(auth, (user) => {
      this.currentUser.set(user);
    });
  }

  async login(email: string, pass: string) {
    return await signInWithEmailAndPassword(auth, email, pass);
  }

  async register(email: string, pass: string) {
    return await createUserWithEmailAndPassword(auth, email, pass);
  }

  async logout() {
    return await signOut(auth);
  }
}
import { Injectable, signal } from '@angular/core';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { auth } from '../firebase/firebase';

@Injectable({ providedIn: 'root' })
export class AuthService {
  usuario = signal<User | null>(null);

  constructor() {
    onAuthStateChanged(auth, (user) => {
      console.log('🔐 onAuthStateChanged:', user?.email ?? 'null');
      this.usuario.set(user);
    });
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  registrar(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  logout() {
    return signOut(auth);
  }

  estaLogueado() {
    return this.usuario() !== null;
  }
}
// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  login(credentials: LoginCredentials): Observable<boolean> {
    return new Observable(observer => {
      // Simular llamada a API
      setTimeout(() => {
        const users = this.getStoredUsers();
        const user = users.find(
          u => u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          const { password, ...userWithoutPassword } = user;
          localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
          this.currentUserSubject.next(userWithoutPassword as User);
          observer.next(true);
          observer.complete();
        } else {
          observer.error('Email o contraseña incorrectos');
        }
      }, 500);
    });
  }

  register(data: RegisterData): Observable<boolean> {
    return new Observable(observer => {
      // Simular llamada a API
      setTimeout(() => {
        const users = this.getStoredUsers();
        
        // Verificar si el email ya existe
        if (users.some(u => u.email === data.email)) {
          observer.error('Este email ya está registrado');
          return;
        }

        const newUser = {
          id: this.generateId(),
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          createdAt: new Date()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Auto-login después del registro
        const { password, ...userWithoutPassword } = newUser;
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        this.currentUserSubject.next(userWithoutPassword as User);

        observer.next(true);
        observer.complete();
      }, 500);
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private getStoredUsers(): any[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  private generateId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getUserInfo(): User | null {
    return this.currentUserValue;
  }
}
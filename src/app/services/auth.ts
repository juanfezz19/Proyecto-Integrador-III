// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, from, map, catchError, switchMap } from 'rxjs';
import { supabase } from '../config/supabase';

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
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
    
    // Verificar sesión al iniciar
    this.checkSession();
  }

  private async checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await this.loadUserProfile(session.user.id);
    }
  }

  private async loadUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        const user: User = {
          id: data.id,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          createdAt: new Date(data.created_at)
        };
        this.currentUserSubject.next(user);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  login(credentials: LoginCredentials): Observable<boolean> {
    return from(
      supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) throw new Error(error.message);
        if (data.user) {
          return from(this.loadUserProfile(data.user.id)).pipe(
            map(() => true)
          );
        }
        return from([false]);
      }),
      catchError((error) => {
        throw error.message || 'Error al iniciar sesión';
      })
    );
  }

  register(data: RegisterData): Observable<boolean> {
    return from(
      supabase.auth.signUp({
        email: data.email,
        password: data.password
      })
    ).pipe(
      switchMap(({ data: authData, error }) => {
        if (error) throw new Error(error.message);
        if (!authData.user) throw new Error('Error al crear usuario');

        // Crear perfil de usuario en la tabla users
        return from(
          supabase.from('users').insert({
            id: authData.user.id,
            email: data.email,
            first_name: data.firstName,
            last_name: data.lastName
          })
        ).pipe(
          switchMap(({ error: profileError }) => {
            if (profileError) throw new Error(profileError.message);
            
            // Cargar perfil después de crear
            return from(this.loadUserProfile(authData.user!.id)).pipe(
              map(() => true)
            );
          })
        );
      }),
      catchError((error) => {
        const message = error.message || 'Error al registrarse';
        if (message.includes('already registered')) {
          throw 'Este email ya está registrado';
        }
        throw message;
      })
    );
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getUserInfo(): User | null {
    return this.currentUserValue;
  }
}
// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, from, map, catchError, of, switchMap, throwError } from 'rxjs';
import { supabase } from '../config/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

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
    
    // Escuchar cambios en la autenticación
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      if (session?.user) {
        await this.loadUserProfile(session.user.id);
      } else {
        this.currentUserSubject.next(null);
      }
    });
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
      map(({ data, error }) => {
        if (error) throw new Error(error.message);
        if (data.user) {
          this.loadUserProfile(data.user.id);
          return true;
        }
        return false;
      }),
      catchError((error) => {
        throw error.message || 'Error al iniciar sesión';
      })
    );
  }

  register(data: RegisterData): Observable<boolean> {
    return from(
      supabase.auth.signUp({
        email: data.email, // Correo del usuario
        password: data.password, // Contraseña del usuario
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          },
        },
      })
    ).pipe(
      switchMap(({ data: authData, error }) => {
        if (error) {
          return throwError(() => new Error(error.message));
        }
        if (!authData.user) {
          return throwError(() => new Error('No se pudo crear el usuario.'));
        }
        // El perfil se crea automáticamente con el trigger de Supabase.
        // Solo necesitamos cargar el perfil del usuario.
        this.loadUserProfile(authData.user.id);
        return of(true);
      }),
      catchError((error) => {
        const message = error.message || 'Ocurrió un error durante el registro.';
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

  // Método para obtener el ID del usuario actual (útil para órdenes)
  getCurrentUserId(): string | null {
    return this.currentUserValue?.id || null;
  }

  // Método alternativo usando la sesión de Supabase directamente
  async getSupabaseUserId(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || null;
  }
}
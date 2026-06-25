import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthResponse } from './api.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8090/auth';

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return localStorage.getItem('token');
  }

  getDecodedToken(): { sub?: string; role?: string } | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      return jwtDecode<{ sub?: string; role?: string }>(token);
    } catch {
      return null;
    }
  }

  getCurrentRole(): string {
    return this.getDecodedToken()?.role ?? '';
  }

  getCurrentEmail(): string {
    return this.getDecodedToken()?.sub ?? '';
  }
}

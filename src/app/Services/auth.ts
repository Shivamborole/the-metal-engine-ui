import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //private apiUrl = 'https://localhost:7025/api/Auth/login';   // UPDATE if needed
  private apiUrl = 'https://localhost:7025/api/Auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // --------------------------
  // LOGIN API CALL
  // --------------------------
  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        if (res.token) {
          this.saveToken(res.token);
        }
      })
    );
  }
 // REGISTER
  register(data: { fullname:string;email: string; phone: string; password: string }): Observable<any>  {
    return this.http.post<any>(`${this.apiUrl}/register`, data);
  }
 
  // FORGOT PASSWORD
  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  // RESET PASSWORD
  resetPassword(token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      token,
      newPassword
    });
  }
  // --------------------------
  // SAVE TOKEN
  // --------------------------
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // --------------------------
  // GET TOKEN
  // --------------------------
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // --------------------------
  // CHECK IF LOGGED IN
  // --------------------------
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // --------------------------
  // LOGOUT
  // --------------------------
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}

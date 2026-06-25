import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  fillDemo(role: 'INVESTOR' | 'FOUNDER' | 'ADMIN') {
    this.loginData.email = `demo.${role.toLowerCase()}@easyinvest.com`;
    this.loginData.password = 'password123';
  }

  onLogin() {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (res: any) => {
        this.loading = false;

        // Save token
        localStorage.setItem('token', res.token);

        // Decode JWT
        const decoded: any = jwtDecode(res.token);
        const role = decoded.role;

        // Redirect
        if (role === 'INVESTOR') {
          this.router.navigate(['/investor/dashboard']);
        } else if (role === 'FOUNDER') {
          this.router.navigate(['/founder/dashboard']);
        } else {
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error?.error?.message ||
          (typeof error?.error === 'string' ? error.error : '') ||
          'Invalid email or password';
      }
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerData = {
    fullName: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    role: 'FOUNDER'
  };

  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Account created successfully. You can sign in now.';
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error?.error?.message ||
          (typeof error?.error === 'string' ? error.error : '') ||
          'Registration failed. Please check your details and try again.';
      }
    });
  }

}

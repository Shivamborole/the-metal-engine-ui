import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})
export class ForgotPasswordComponent {

  email = '';
  message = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(f: NgForm) {
    if (f.invalid) {
      this.error = 'Please enter a valid email';
      return;
    }

    this.error = '';
    this.loading = true;

    this.auth.forgotPassword(this.email).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.message = 'If this email exists, a reset link has been sent.';
      },
      error: () => {
        this.loading = false;
        this.message = 'If this email exists, a reset link has been sent.';
      }
    });
  }
}

import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register-user.html',
  styleUrls: ['./register-user.scss']
})
export class RegisterComponent {
  fullname = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  error = '';
  success = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) { }

  onSubmit(f: NgForm) {
    this.error = '';
    this.success = '';

    if (f.invalid) {
      this.error = 'Please fill all required fields correctly';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;

    const data = {
      fullname: this.fullname,
      email: this.email,
      phone: this.phone,
      password: this.password
    };

    this.auth.register(data).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.success = res?.message || "Registration successful!";
        console.log(res);
        setTimeout(() => this.router.navigate(['/companies/add']), 1500);
      },
      error: (err) => {
        console.log("RAW ERROR --->", err);
        this.loading = false;
        this.error = err.error?.message || "Registration failed. Try again.";
      }
    });


  }
}

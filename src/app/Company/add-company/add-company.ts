import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from '../../Services/company-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-company',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-company.html',
  styleUrl: './add-company.scss'
})
export class AddCompanyComponent {

  companyForm!: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      gstNumber: [''],
      website: [''],

      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', Validators.required],

      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['India', Validators.required],

      bankName: ['', Validators.required],
      accountNumber: ['', Validators.required],

      IFSC: ['', Validators.required],      // FIXED
      BranchName: ['', Validators.required],// FIXED
      UPIId: ['', Validators.required]      // FIXED + ADDED
    });

  }

  onSubmit() {
    if (this.companyForm.invalid) {
      this.error = 'Please fill all required fields.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.companyService.createCompany(this.companyForm.value).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.success = res?.message || 'Company created successfully';
        setTimeout(() => this.router.navigate(['/companies']), 800);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to create company';
      }
    });
  }
}

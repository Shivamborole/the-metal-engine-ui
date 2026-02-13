import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../../Services/company-service';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './company-profile.html',
  styleUrls: ['./company-profile.scss']
})
export class CompanyProfileComponent implements OnInit {

  form!: FormGroup;
  companyId: string | null = null;
  isEditMode = false;
  loading = true;

  logoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.companyId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.companyId;

    this.buildForm();

    if (this.isEditMode) {
      this.loadCompany();
    } else {
      this.loading = false;
    }
  }

  buildForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      gstNumber: [''],
      address: [''],
      city: [''],
      state: [''],
      country: [''],

      email: [''],
      mobileNumber: [''],
      website: [''],

      bankName: [''],
      accountNumber: [''],
      ifsc: [''],
      branchName: [''],
      upiId: [''],

      logoUrl: [null]
    });
  }

  loadCompany() {
    this.companyService.getCompanies().subscribe({
      next: (companies: any[]) => {

        const company = companies.find(c => c.id === this.companyId);

        if (!company) {
          alert("Company not found");
          this.router.navigate(['/companies']);
          return;
        }

        this.form.patchValue(company);

        // Logo support only if backend returns OR saved earlier
        this.logoPreview = company.logoUrl ? company.logoUrl : null;

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        alert("Failed to load company");
        this.loading = false;
      }
    });
  }


  onLogoSelect(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.logoPreview = reader.result as string;
      this.form.patchValue({ logoUrl: this.logoPreview });
    };
    reader.readAsDataURL(file);
  }

  removeLogo() {
    this.logoPreview = null;
    this.form.patchValue({ logoUrl: null });
  }

  save() {
    if (this.form.invalid) return;

    const payload = this.form.value;

    if (this.isEditMode) {
      this.companyService.updateCompany(this.companyId!, payload).subscribe({
        next: () => {
          alert("Company updated successfully");
          this.router.navigate(['/companies']);
        }
      });
    } else {
      this.companyService.createCompany(payload).subscribe({
        next: () => {
          alert("Company created successfully");
          this.router.navigate(['/companies']);
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/companies']);
  }
}

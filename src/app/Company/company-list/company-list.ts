import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../Services/company-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-list.html',
  styleUrls: ['./company-list.scss']
})
export class CompanyListComponent implements OnInit {

  companies: any[] = [];
  loading = false;
  error = '';

  constructor(
    private companyService: CompanyService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies() {
    this.loading = true;

    this.companyService.getCompanies().subscribe({
      next: (res: any[]) => {
        this.loading = false;
        this.companies = res || [];
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Failed to load companies';
      }
    });
  }

  goToAdd() {
    this.router.navigate(['/companies/add']);
  }

  deleteCompany(id: string) {
    if (!confirm("Are you sure you want to delete this company?")) return;

    this.companyService.deleteCompany(id).subscribe({
      next: () => {
        this.companies = this.companies.filter(x => x.id !== id);
      },
      error: () => alert("Failed to delete company")
    });
  }

  useCompany(company: any) {
    this.companyService.setActiveCompany(company.id).subscribe({
      next: (res: any) => {

        alert(res.message);

        // After activation → fetch active company again
        this.companyService.getActiveCompany().subscribe(active => {
          if (active) {
           this.companyService.setActiveCompanyState(active as { companyId: string; companyName: string });
          }
        });


        // Refresh table
        this.loadCompanies();
      },
      error: () => alert("Failed to activate company")
    });
  }


}

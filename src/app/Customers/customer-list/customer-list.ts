import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../Services/customer-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../Services/company-service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-list.html',
  styleUrls: ['./customer-list.scss']
})
export class CustomerListComponent implements OnInit {

  customers: any[] = [];
  loading = false;

  constructor(
    private customerService: CustomerService,
    private companyService: CompanyService,
    private router: Router
  ) {}

  ngOnInit(): void {

    // 🔥 Listen for active company from global state
    this.companyService.activeCompany$.subscribe(active => {

      // If no active company → show empty state
      if (!active || !active.companyId) {
        this.customers = [];
        return;
      }

      // Load correct company's customers
      this.loadCustomers(active.companyId);
    });
  }

  loadCustomers(companyId: string) {
    this.loading = true;

    this.customerService.getCustomers(companyId).subscribe({
      next: (res) => {
        this.loading = false;
        this.customers = res || [];
      },
      error: () => {
        this.loading = false;
        alert('Failed to load customers');
      }
    });
  }

  goToAdd() {
    this.router.navigate(['/customers/add']);
  }

  editCustomer(id: string) {
    this.router.navigate(['/customers/edit', id]);
  }
}

import { Component, OnInit } from '@angular/core';
import { SalesOrderService } from '../../../Services/sales-order-service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../../Services/company-service';

@Component({
  selector: 'app-sales-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sales-order-list.html',
  styleUrl: './sales-order-list.scss'
})
export class SalesOrderListComponent implements OnInit {

  salesOrders: any[] = [];
  loading = true;

  constructor(
    private companyService: CompanyService,
    private soService: SalesOrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.companyService.activeCompany$.subscribe(company => {
      if (!company?.companyId) return;
      this.loadSalesOrders(company.companyId);
    });
  }

  private loadSalesOrders(companyId: string): void {
    this.loading = true;

    this.soService.getSalesOrders(companyId).subscribe({
      next: data => {
        this.salesOrders = data;
        this.loading = false;
      },
      error: err => {
        console.error('Failed to load Sales Orders', err);
        this.loading = false;
      }
    });
  }

  openDetail(id: string): void {
    this.router.navigate(['/sales/sales-orders/details', id]);
   
  }
}

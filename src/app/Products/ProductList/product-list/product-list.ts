import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../Services/product-service';
import { CompanyService } from '../../../Services/company-service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss']
})
export class ProductListComponent implements OnInit {

  products: any[] = [];
  loading = false;
  error = '';

  constructor(
    private productService: ProductService,
    private companyService: CompanyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.companyService.activeCompany$.subscribe(active => {

      // If no active company → show empty state
      if (!active || !active.companyId) {
       this.error = 'No active company selected.';
      return;
      }

      // Load correct company's customers
       this.loadProducts(active.companyId);
    });

    // const companyId = localStorage.getItem('activeCompanyId');
    // if (!companyId) {
    //   this.error = 'No active company selected.';
    //   return;
    // }

    // this.loadProducts(companyId);
  }

  loadProducts(companyId: string) {
    this.loading = true;
    this.error = '';

    this.productService.getProducts(companyId).subscribe({
      next: (res) => {
        this.loading = false;
        this.products = res || [];
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load products.';
      }
    });
  }

  goToAdd() {
    this.router.navigate(['/products/add']);
  }

  editProduct(id: string) {
    this.router.navigate(['/products/edit', id]);
  }

  deleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== id);
      },
      error: () => alert('Failed to delete product')
    });
  }
}

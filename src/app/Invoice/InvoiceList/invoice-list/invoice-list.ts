import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceService } from '../../../Services/invoice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.html',
  styleUrls: ['./invoice-list.scss'],
  imports: [CommonModule, FormsModule]
})
export class InvoiceList implements OnInit {

  invoices: any[] = [];
  filtered: any[] = [];

  searchText = '';
  typeFilter = 'all';
  statusFilter = 'all';
  paymentFilter = 'all'; // ⭐ NEW

  constructor(
    private invoiceService: InvoiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
    const companyId = localStorage.getItem('selectedCompanyId') ?? '';

    this.invoiceService.getInvoices(companyId).subscribe(res => {
      this.invoices = res.map(x => ({
        ...x,
        paymentStatus: this.mapPaymentStatus(x.paymentStatus),
        status: this.mapDocStatus(x.status)
      }));

      this.filtered = [...this.invoices];
    });
  }

  mapPaymentStatus(code: number) {
    switch (code) {
      case 1: return 'unpaid';
      case 2: return 'paid';
      case 3: return 'partial';
      default: return 'unknown';
    }
  }

  mapDocStatus(code: number) {
    switch (code) {
      case 1: return 'draft';
      case 2: return 'final';
      case 3: return 'cancelled';
      default: return 'unknown';
    }
  }

  applyFilters() {
    const keyword = this.searchText.toLowerCase();

    this.filtered = this.invoices.filter(inv => {
      const searchMatch =
        inv.invoiceNumber.toLowerCase().includes(keyword) ||
        inv.customerName.toLowerCase().includes(keyword);

      const typeMatch =
        this.typeFilter === 'all' ||
        (this.typeFilter === 'invoice' && inv.documentType === 2) ||
        (this.typeFilter === 'quotation' && inv.documentType === 1);

      const statusMatch =
        this.statusFilter === 'all' ||
        inv.status === this.statusFilter;

      const paymentMatch =
        this.paymentFilter === 'all' ||
        inv.paymentStatus === this.paymentFilter;

      return searchMatch && typeMatch && statusMatch && paymentMatch;
    });
  }

  toggleMenu(inv: any) {
    this.invoices.forEach(x => x.open = false);
    inv.open = !inv.open;
  }

  newInvoice() {
    this.router.navigate(['/invoice/new']);
  }

  editInvoice(id: string) {
    this.router.navigate(['/invoice/edit', id]);
  }

  openPDF(id: string) {
    window.open(
      `https://localhost:7025/api/invoices/${id}/pdf`,
      '_blank'
    );
  }

  // ⭐ MARK AS PAID
  markAsPaid(inv: any) {
    if (!confirm('Mark this invoice as PAID?')) return;

    this.invoiceService.updatePaymentStatus(inv.id, 2).subscribe(() => {
      inv.paymentStatus = 'paid';
      this.applyFilters();
    });
  }

  // ⭐ CONVERT QUOTATION → INVOICE
  convertToInvoice(inv: any) {

    if (!confirm('Convert this quotation into a final invoice?')) return;

    this.invoiceService.convertQuotation(inv.id).subscribe(() => {
      this.loadInvoices();
    });
  }

  deleteInvoice(id: string) {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    this.invoiceService.deleteInvoice(id).subscribe(() => {
      this.loadInvoices();
    });
  }
}

import { Component, Input, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
// import {
//   DeliveryChallanListItem,
//   DeliveryChallanStatus
// } from '../../../core/models/delivery-challan.models';
import { DeliveryChallanService } from '../../Services/delivery-challan-service';
import { FormsModule, NgForm } from '@angular/forms';
export enum DeliveryChallanStatus {
  Draft = 0,
  Final = 1,
  Cancelled = 2
}

export interface DeliveryChallanListItem {
  id: string;
  challanNumber: string;
  challanDate: string; // ISO
  customerName: string;
  status: DeliveryChallanStatus;
  totalDeliveredQty: number;
  totalRejectedQty: number;
}

export interface DeliveryChallanItemDto {
  id: string;
  invoiceItemId: string;
  productId?: string | null;
  itemName: string;
  unit: string;
  quantity: number;
  remarks?: string;
}

export interface DeliveryChallanDetail {
  id: string;
  companyId: string;
  invoiceDocumentId?: string | null;
  customerId: string;
  customerName: string;
  challanNumber: string;
  challanDate: string;
  type: number;
  status: DeliveryChallanStatus;
  vehicleNumber?: string;
  transporterName?: string;
  notes?: string;
  createdByUserId: string;
  createdByUserName: string;
  createdAt: string;
  items: DeliveryChallanItemDto[];
}

@Component({
  standalone: true,
  selector: 'app-invoice-delivery-challans',
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './delivery-challan-list.html',
  styleUrls: ['./delivery-challan-list.scss']
})
export class DeliveryChallansComponent implements OnInit {
 allChallans: any[] = [];
  filteredChallans: any[] = [];
  filterSO: string = '';
  openMenu: number | null = null;

  constructor(
    private dcService: DeliveryChallanService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadChallans();
  }

  /** =====================================================
   * LOAD ALL DELIVERY CHALLANS
   * ===================================================== */
  loadChallans() {
    // this.dcService.getAll().subscribe({
    //   next: (res) => {
    //     this.allChallans = res || [];
    //     this.filteredChallans = [...this.allChallans]; // show all initially
    //   },
    //   error: (err) => {
    //     console.error('Error loading challans:', err);
    //     this.allChallans = [];
    //     this.filteredChallans = [];
    //   }
    // });
  }

  /** =====================================================
   * FILTER BY SALES ORDER NUMBER (optional)
   * ===================================================== */
  applyFilter() {
    const so = this.filterSO.trim();

    if (!so) {
      this.filteredChallans = [...this.allChallans]; // reset filter
      return;
    }

    this.filteredChallans = this.allChallans.filter(dc =>
      dc.salesOrderNumber?.toString().includes(so)
    );
  }

  /** =====================================================
   * STATUS BADGES
   * 0 = Draft, 1 = Final, 2 = Cancelled
   * ===================================================== */
  statusClass(status: number) {
    const classes: any = {
      0: 'badge-warning',
      1: 'badge-success',
      2: 'badge-danger'
    };
    return classes[status] || 'badge-warning';
  }

  statusLabel(status: number) {
    const labels: any = {
      0: 'Draft',
      1: 'Final',
      2: 'Cancelled'
    };
    return labels[status] || 'Draft';
  }

  /** =====================================================
   * ACTION MENU TOGGLE
   * ===================================================== */
  toggleMenu(id: number) {
    this.openMenu = this.openMenu === id ? null : id;
  }

  /** =====================================================
   * ACTION HANDLERS
   * ===================================================== */
  createChallan() {
    this.router.navigate(['/sales/challans/create']);
  }

  view(dc: any) {
    this.router.navigate(['/sales/challans/view', dc.id]);
  }

  edit(dc: any) {
    if (dc.status === 1) {
      alert('Cannot edit a final challan.');
      return;
    }
    this.router.navigate(['/sales/challans/edit', dc.id]);
  }

  print(dc: any) {
    this.router.navigate(['/sales/challans/print', dc.id]);
  }

}

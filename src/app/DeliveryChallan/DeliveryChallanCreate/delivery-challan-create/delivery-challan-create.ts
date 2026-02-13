import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CompanyService } from '../../../Services/company-service';
import { SalesOrderService } from '../../../Services/sales-order-service';
import { DeliveryChallanService } from '../../../Services/delivery-challan-service';

@Component({
  standalone: true,
  selector: 'app-delivery-challan-create',
  templateUrl: './delivery-challan-create.html',
  styleUrls: ['./delivery-challan-create.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  encapsulation: ViewEncapsulation.None
})
export class DeliveryChallanCreateComponent implements OnInit {

  form!: FormGroup;
  salesOrders: any[] = [];
  activeCompanyId!: string;

  summary = {
    totalItems: 0,
    totalOrderedQty: 0,
    deliverThisTrip: 0,
    remainingAfterThisTrip: 0
    
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private companyService: CompanyService,
    private soService: SalesOrderService,
    private dcService: DeliveryChallanService
  ) {}

  ngOnInit(): void {
    this.buildForm();

    this.companyService.activeCompany$.subscribe(active => {
      if (!active?.companyId) return;
      this.activeCompanyId = active.companyId;

      this.loadSalesOrders();
      this.loadNextChallanNumber();
    });
  }

  buildForm() {
    this.form = this.fb.group({
      challanNumber: [{ value: '', disabled: true }],
      challanDate: [this.today(), Validators.required],
      challanType: [0],
      vehicleNumber: [''],
      transporterName: [''],
      notes: [''],

      salesOrderId: ['', Validators.required],
      customerName: [{ value: '', disabled: true }],

      items: this.fb.array([])
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  today() {
    return new Date().toISOString().substring(0, 10);
  }

  // ---------------- LOADERS ----------------

  loadSalesOrders() {
    this.soService.getSalesOrders(this.activeCompanyId)
      .subscribe(res => this.salesOrders = res || []);
  }

  loadNextChallanNumber() {
    this.dcService.previewNextChallanNumber(this.activeCompanyId)
      .subscribe(res => {
        this.form.patchValue({ challanNumber: res.challanNumber });
      });
  }

  // ---------------- SO CHANGE ----------------

  onSOChange(event: any) {
    const soId = event.target.value;
    if (!soId) return;

    // 1️⃣ Get SO detail
    this.soService.getSalesOrder(soId, this.activeCompanyId)
      .subscribe(so => {

        this.form.patchValue({
          //customerName: so.customerName
        });

        // 2️⃣ Get delivery summary
        this.dcService.getDeliveredSummary(soId)
          .subscribe(summary => {
            this.buildItemRows(so, summary);
            this.recalculateSummary();
          });
      });
  }

  // ---------------- ITEMS ----------------

  buildItemRows(so: any, summaryItems: any[]) {
    this.items.clear();

    so.items.forEach((item: any) => {
      const delivered =
        summaryItems.find((x: any) => x.salesOrderItemId === item.id)?.deliveredQty || 0;

      const remaining = item.orderedQty - delivered;

      this.items.push(this.fb.group({
        salesOrderItemId: item.id,
        productName: item.itemName,
        orderedQty: item.orderedQty,
        deliveredQty: delivered,
        remainingQty: remaining,
        deliverNowQty: [0, [Validators.min(0), Validators.max(remaining)]],
        error: ['']
      }));
    });
  }

  validateRow(row: AbstractControl) {
    const d = +row.get('deliverNowQty')!.value;
    const r = +row.get('remainingQty')!.value;

    row.get('error')!.setValue(
      d > r ? 'Cannot exceed remaining quantity'
      : d < 0 ? 'Quantity cannot be negative'
      : ''
    );

    this.recalculateSummary();
  }

  recalculateSummary() {
    let ordered = 0, deliver = 0;

    this.items.controls.forEach(r => {
      ordered += +r.get('orderedQty')!.value;
      deliver += +r.get('deliverNowQty')!.value;
    });

    this.summary = {
      totalItems: this.items.length,
      totalOrderedQty: ordered,
      deliverThisTrip: deliver,
      remainingAfterThisTrip: ordered - deliver
    };
  }

  // ---------------- SAVE ----------------

  submit() {
    if (this.items.controls.some(r => r.get('error')!.value)) {
      alert('Fix errors before saving');
      return;
    }

    const raw = this.form.getRawValue();

    const payload = {
      salesOrderId: raw.salesOrderId,
      challanDate: raw.challanDate,
      type: raw.challanType,
      vehicleNumber: raw.vehicleNumber,
      transporterName: raw.transporterName,
      notes: raw.notes,
      items: raw.items
        .filter((x: any) => x.deliverNowQty > 0)
        .map((x: any) => ({
          salesOrderItemId: x.salesOrderItemId,
          quantity: x.deliverNowQty
        }))
    };

    this.dcService.createDeliveryChallan(this.activeCompanyId,payload)
      .subscribe(() => this.router.navigate(['/sales/challans']));
  }

  cancel() {
    this.router.navigate(['/sales/challans']);
  }
}


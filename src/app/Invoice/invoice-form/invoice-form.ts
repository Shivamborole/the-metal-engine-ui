import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ProductService } from '../../Services/product-service';
import { CustomerService } from '../../Services/customer-service';
import { CompanyService } from '../../Services/company-service';
import { InvoiceService } from '../../Services/invoice';

@Component({
  standalone: true,
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.html',
  styleUrls: ['./invoice-form.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class InvoiceForm implements OnInit {

  form!: FormGroup;
  customers: any[] = [];
  products: any[] = [];

  activeCompanyId!: string;
  activeCompanyState!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private customerService: CustomerService,
    private productService: ProductService,
    private invoiceService: InvoiceService,
    private companyService: CompanyService
  ) { }

  // ---------------------------------------------
  // Getters for Quotation / Invoice UI switching
  // ---------------------------------------------
  get isQuotation(): boolean {
    return Number(this.form?.get('documentType')?.value) === 1;
  }

  get isInvoice(): boolean {
    return Number(this.form?.get('documentType')?.value) === 2;
  }

  // ---------------------------------------------
  // INIT
  // ---------------------------------------------
  ngOnInit(): void {
    this.buildForm();

    // Normalize value as number always
    this.form.get('documentType')?.valueChanges.subscribe(v => {
      this.form.patchValue({ documentType: Number(v) }, { emitEvent: false });
    });

    this.setDefaultDateTime();

    this.companyService.activeCompany$.subscribe(active => {
      if (!active?.companyId) return;

      this.activeCompanyId = active.companyId;
      this.activeCompanyState = active.state || "";

      this.loadCustomers();
      this.loadProducts();
      this.loadNextInvoiceNumber();
    });
  }

  // ---------------------------------------------
  // Set today's date & time defaults
  // ---------------------------------------------
  setDefaultDateTime() {
    const now = new Date();
    const iso = now.toISOString().substring(0, 10);

    const hr = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');

    this.form.patchValue({
      invoiceDate: iso,
      timeOfSupply: `${hr}:${min}`
    });
  }

  // ---------------------------------------------
  // Build Form
  // ---------------------------------------------
  buildForm() {
    this.form = this.fb.group({
      documentType: [2, Validators.required],  // Invoice = 2, Quotation = 1

      invoiceNumber: [{ value: '', disabled: true }],
      invoiceDate: ['', Validators.required],
      timeOfSupply: [''],
      placeOfSupply: [''],
      //placeOfSupply: ['', Validators.required],
      transportMode: [''],
      vehicleNumber: [''],
      ewayBillNumber: [''],
      purchaseOrderNo: [''],
      purchaseOrderDate: [''],

      customerId: ['', Validators.required],
      vendorCode: [''],
      //Addded later
      dueDate: [''],
      referenceNumber: [''],

      // Billing
      billingName: [''],
      billingGSTIN: [''],
      billingState: [''],
      billingStateCode: [''],
      billingAddress: [''],
      billingCity: [''],

      // Shipping
      shippingSame: [false],
      shippingName: [''],
      shippingGSTIN: [''],
      shippingState: [''],
      shippingStateCode: [''],
      shippingAddress: [''],
      shippingCity: [''],

      // Items
      items: this.fb.array([]),

      transportCharges: [0],
      loadingCharges: [0],

      subTotal: [0],
      cgstTotal: [0],
      sgstTotal: [0],
      igstTotal: [0],
      totalTax: [0],
      roundOff: [0],
      grandTotal: [0],
    });

    this.addItem();
  }

  // ---------------------------------------------
  // ITEMS
  // ---------------------------------------------
  get items(): FormArray<FormGroup> {
    return this.form.get('items') as FormArray<FormGroup>;
  }

  newItem(): FormGroup {
    return this.fb.group({
      productId: [''],
      name: ['', Validators.required],
      hsnCode: [''],
      quantity: [1],
      unitPrice: [0],
      discountPercent: [0],
      cgstRate: [0],
      sgstRate: [0],
      igstRate: [0],
      lineTotal: [{ value: 0, disabled: true }]
    });
  }

  addItem() {
    this.items.push(this.newItem());
    this.updateTotals();
  }

  removeItem(i: number) {
    this.items.removeAt(i);
    this.updateTotals();
  }

  // ---------------------------------------------
  // LOAD DATA
  // ---------------------------------------------
  loadCustomers() {
    this.customerService.getCustomers(this.activeCompanyId).subscribe(res => {
      this.customers = res || [];
    });
  }

  loadProducts() {
    this.productService.getProducts(this.activeCompanyId).subscribe(res => {
      this.products = res || [];
    });
  }

  loadNextInvoiceNumber() {
    this.invoiceService.previewNextInvoiceNumber(this.activeCompanyId)
      .subscribe(res => {
        this.form.patchValue({ invoiceNumber: res.invoiceNumber });
      });
  }

  // ---------------------------------------------
  // CUSTOMER CHANGE
  // ---------------------------------------------
  onCustomerChange(e: any) {
    const id = e.target.value;
    if (!id) return;

    this.customerService.getCustomer(id).subscribe(c => {
      const billingAddr = [c.billingAddressLine1, c.billingAddressLine2]
        .filter(Boolean).join(', ');

      const shippingAddr = c.shippingSame
        ? billingAddr
        : [c.shippingAddressLine1, c.shippingAddressLine2].filter(Boolean).join(', ');

      // Billing
      this.form.patchValue({
        vendorCode: c.vendorCode || "",
        billingName: c.customerName,
        billingGSTIN: c.gstNumber,
        billingState: c.billingState,
        billingStateCode: c.billingPincode,
        billingAddress: billingAddr,
        billingCity: c.billingCity,
      });

      // Shipping
      this.form.patchValue({
        shippingSame: c.shippingSame,
        shippingName: c.shippingSame ? c.customerName : c.shippingName,
        shippingGSTIN: c.gstNumber,
        shippingState: c.shippingSame ? c.billingState : c.shippingState,
        shippingStateCode: c.shippingSame ? c.billingPincode : c.shippingPincode,
        shippingAddress: shippingAddr,
        shippingCity: c.shippingSame ? c.billingCity : c.shippingCity
      });

      this.applyIGSTSwitching();
      this.updateTotals();
    });
  }

  // ---------------------------------------------
  // PRODUCT CHANGE
  // ---------------------------------------------
  onProductChange(i: number, event: any) {
    const productId = event.target.value;
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const row = this.items.at(i);

    row.patchValue({
      name: product.name,
      hsnCode: product.hsnOrSac,
      unitPrice: product.unitPrice,
    });

    this.setProductGST(row, product.gstRate);
    this.updateTotals();
  }

  // ---------------------------------------------
  // GST SWITCHING (Interstate / Intrastate)
  // ---------------------------------------------
  setProductGST(row: FormGroup, gstRate: number) {
    const buyer = (this.form.value.billingState || "").toLowerCase();
    const seller = (this.activeCompanyState || "").toLowerCase();

    if (buyer === seller) {
      row.patchValue({
        cgstRate: gstRate / 2,
        sgstRate: gstRate / 2,
        igstRate: 0
      });
    } else {
      row.patchValue({
        cgstRate: 0,
        sgstRate: 0,
        igstRate: gstRate
      });
    }
  }

  applyIGSTSwitching() {
    this.items.controls.forEach(row => {
      const gstRate = (row.value.cgstRate + row.value.sgstRate + row.value.igstRate);
      this.setProductGST(row as FormGroup, gstRate);
    });
  }

  // ---------------------------------------------
  // COPY BILLING TO SHIPPING
  // ---------------------------------------------
  copyBillingToShipping() {
    if (!this.form.value.shippingSame) return;

    this.form.patchValue({
      shippingName: this.form.value.billingName,
      shippingGSTIN: this.form.value.billingGSTIN,
      shippingState: this.form.value.billingState,
      shippingStateCode: this.form.value.billingStateCode,
      shippingAddress: this.form.value.billingAddress,
      shippingCity: this.form.value.billingCity
    });
  }

  // ---------------------------------------------
  // TOTALS CALCULATION
  // ---------------------------------------------
  updateTotals() {
    let sub = 0, cg = 0, sg = 0, ig = 0;

    this.items.controls.forEach((row: any) => {
      const qty = +row.value.quantity;
      const rate = +row.value.unitPrice;
      const disc = +row.value.discountPercent;

      const base = qty * rate;
      const discount = base * (disc / 100);
      const taxable = base - discount;

      const cgst = taxable * (row.value.cgstRate / 100);
      const sgst = taxable * (row.value.sgstRate / 100);
      const igst = taxable * (row.value.igstRate / 100);

      const total = taxable + cgst + sgst + igst;

      row.patchValue({ lineTotal: total.toFixed(2) }, { emitEvent: false });

      sub += taxable;
      cg += cgst;
      sg += sgst;
      ig += igst;
    });

    const transport = +this.form.value.transportCharges;
    const loading = +this.form.value.loadingCharges;

    let grand = sub + cg + sg + ig + transport + loading;
    const round = +(grand - Math.round(grand)).toFixed(2);

    this.form.patchValue({
      subTotal: sub.toFixed(2),
      cgstTotal: cg.toFixed(2),
      sgstTotal: sg.toFixed(2),
      igstTotal: ig.toFixed(2),
      totalTax: (cg + sg + ig).toFixed(2),
      roundOff: round,
      grandTotal: Math.round(grand).toFixed(2)
    });
  }

  // ---------------------------------------------
  // SUBMIT
  // ---------------------------------------------
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    const isQuotation = raw.documentType == 1;  // 1 = Quotation
    const isInvoice = raw.documentType == 2;    // 2 = Invoice

    const payload = {
      companyId: this.activeCompanyId,
      customerId: raw.customerId,

      // required for backend
      documentType: raw.documentType,

      // invoice fields
      invoiceDate: raw.invoiceDate,
      dueDate: isQuotation ? raw.dueDate : raw.invoiceDate,

      // quotation reference
      referenceNumber: isQuotation ? raw.referenceNumber : raw.purchaseOrderNo,

      placeOfSupply: raw.placeOfSupply,
      notes: "",
      termsAndConditions: "",
      isGstInclusive: false,
      transportCharges: raw.transportCharges,
      loadingCharges: raw.loadingCharges,
      items: raw.items.map((x: any) => ({
        productId: x.productId || null,
        itemName: x.name,
        hsnCode: x.hsnCode,
        unit: "Nos",
        quantity: x.quantity,
        unitPrice: x.unitPrice,
        discountPercent: x.discountPercent,
        gstRate: (x.cgstRate + x.sgstRate + x.igstRate),
        saveAsProduct: false
      }))
    };

    this.invoiceService.createInvoice(payload).subscribe({
      next: res => {
        console.log("SUBMIT CLICKED");
        alert(
          (isQuotation ? "Quotation" : "Invoice") + " created: " + res.invoiceNumber
        );
        this.router.navigate(['/invoices']);
      },
      error: err => {
        console.error(err);
        alert("Failed to save document");
      }
    });
  }


  cancel() {
    this.router.navigate(['/invoices']);
  }
}

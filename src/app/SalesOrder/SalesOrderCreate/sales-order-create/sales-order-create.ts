import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { Router, ActivatedRoute } from '@angular/router';

import { CustomerService } from '../../../Services/customer-service';
import { ProductService } from '../../../Services/product-service';
import { SalesOrderService } from '../../../Services/sales-order-service';
import { CompanyService } from '../../../Services/company-service';



@Component({
  standalone: true,
  selector: 'app-sales-order-create',
  templateUrl: './sales-order-create.html',
  styleUrls: ['./sales-order-create.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class SalesOrderCreateComponent implements OnInit {


  form!: FormGroup;

  customers: any[] = [];

  products: any[] = [];

  activeCompanyId!: string;

  salesOrderId!: string;

  isViewMode = false;



  constructor(

    private fb: FormBuilder,

    private router: Router,

    private route: ActivatedRoute,

    private customerService: CustomerService,

    private productService: ProductService,

    private salesOrderService: SalesOrderService,

    private companyService: CompanyService

  ) { }



  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.buildForm();


    // GET ID FROM ROUTE
    this.salesOrderId = this.route.snapshot.paramMap.get('id') || '';

    this.isViewMode = !!this.salesOrderId;


    // WAIT FOR COMPANY CONTEXT
    this.companyService.activeCompany$.subscribe(company => {

      if (!company?.companyId)
        return;

      this.activeCompanyId = company.companyId;


      this.loadCustomers();

      this.loadProducts();


      if (this.isViewMode)
        this.loadSalesOrder();
      else
        this.loadNextNumber();

    });

  }



  // =====================================================
  // BUILD FORM
  // =====================================================

  buildForm(): void {

    this.form = this.fb.group({

      salesOrderNumber: [{ value: '', disabled: true }],

      salesOrderDate: ['', Validators.required],

      placeOfSupply: [''],

      purchaseOrderNo: [''],

      purchaseOrderDate: [''],

      customerId: [''],

      Notes: [''],


      billingName: [''],

      billingGSTIN: [''],

      billingState: [''],

      billingStateCode: [''],

      billingAddress: [''],


      shippingName: [''],

      shippingGSTIN: [''],

      shippingState: [''],

      shippingStateCode: [''],

      shippingAddress: [''],


      items: this.fb.array([]),

      grandTotal: [0]

    });

  }



  // =====================================================
  // GET ITEMS
  // =====================================================

  get items(): FormArray {

    return this.form.get('items') as FormArray;

  }



  // =====================================================
  // NEW ITEM
  // =====================================================

  newItem(): FormGroup {

    return this.fb.group({

      productId: [''],

      name: [''],

      quantity: [1],

      unitPrice: [0],

      lineTotal: [0]

    });

  }



  // =====================================================
  // ADD ITEM
  // =====================================================

  addItem(): void {

    this.items.push(this.newItem());

  }



  // =====================================================
  // LOAD CUSTOMERS
  // =====================================================

  loadCustomers(): void {

    this.customerService
      .getCustomers(this.activeCompanyId)
      .subscribe({

        next: res => this.customers = res || [],

        error: err => console.error(err)

      });

  }



  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  loadProducts(): void {

    this.productService
      .getProducts(this.activeCompanyId)
      .subscribe({

        next: res => this.products = res || [],

        error: err => console.error(err)

      });

  }



  // =====================================================
  // LOAD NEXT NUMBER
  // =====================================================

  loadNextNumber(): void {

    this.salesOrderService
      .previewNextSalesOrderNumber(this.activeCompanyId)
      .subscribe({

        next: res => {

          this.form.patchValue({

            salesOrderNumber: res.salesOrderNumber

          });

        },

        error: err => console.error(err)

      });

  }



  // =====================================================
  // LOAD SALES ORDER DETAIL
  // =====================================================

  loadSalesOrder(): void {

    if (!this.salesOrderId)
      return;


    console.log("Loading Sales Order:", this.salesOrderId);


    this.salesOrderService
      .getSalesOrder(this.activeCompanyId, this.salesOrderId)
      .subscribe({

        next: order => {

          console.log("API Response:", order);


          if (!order)
            return;


          // CLEAR EXISTING ITEMS
          this.items.clear();


          // ADD ITEMS
          order.items?.forEach((item: any) => {

            const row = this.newItem();

            row.patchValue({

              productId: item.productId,

              name: item.itemName,

              quantity: item.quantity,

              unitPrice: item.unitPrice,

              lineTotal: item.lineTotal

            });

            this.items.push(row);

          });


          // PATCH FORM
          this.form.patchValue({

            salesOrderNumber: order.salesOrderNumber,

            salesOrderDate: order.salesOrderDate,

            placeOfSupply: order.placeOfSupply,

            purchaseOrderNo: order.poNumber,

            purchaseOrderDate: order.purchaseOrderDate,

            customerId: order.customerId,

            Notes: order.notes,


            billingName: order.billing?.name,

            billingGSTIN: order.billing?.gstin,

            billingState: order.billing?.state,

            billingStateCode: order.billing?.stateCode,

            billingAddress: order.billing?.address,


            shippingName: order.shipping?.name,

            shippingGSTIN: order.shipping?.gstin,

            shippingState: order.shipping?.state,

            shippingStateCode: order.shipping?.stateCode,

            shippingAddress: order.shipping?.address,


            grandTotal: order.grandTotal

          });


          this.updateTotals();


          if (this.isViewMode)
            this.form.disable();

        },

        error: err => {

          console.error("Failed to load Sales Order:", err);

        }

      });

  }



  // =====================================================
  // PRODUCT CHANGE
  // =====================================================

  onProductChange(index: number, e: any): void {

    const productId = e.target.value;

    const product = this.products.find(x => x.id === productId);

    if (!product)
      return;


    const row = this.items.at(index);

    row.patchValue({

      name: product.name,

      unitPrice: product.unitPrice

    });


    this.updateTotals();

  }



  // =====================================================
  // TOTAL CALCULATION
  // =====================================================

  updateTotals(): void {

    let total = 0;


    this.items.controls.forEach(row => {

      const qty = Number(row.value.quantity || 0);

      const price = Number(row.value.unitPrice || 0);

      const lineTotal = qty * price;


      row.patchValue({

        lineTotal: lineTotal

      }, { emitEvent: false });


      total += lineTotal;

    });


    this.form.patchValue({

      grandTotal: total

    });

  }



  // =====================================================
  // SUBMIT
  // =====================================================

  submit(): void {

    if (this.form.invalid)
      return;


    const payload = this.form.getRawValue();


    this.salesOrderService
      .createSalesOrder(this.activeCompanyId, payload)
      .subscribe({

        next: () => {

          alert("Sales Order Created");

          this.router.navigate(['/sales/sales-orders']);

        },

        error: err => {

          console.error(err);

          alert("Failed to create Sales Order");

        }

      });

  }

onCustomerChange(event: any): void {

  if (this.isViewMode)
    return;

  const customerId = event?.target?.value;

  if (!customerId)
    return;


  this.customerService
    .getCustomer(customerId)
    .subscribe({

      next: (customer) => {

        if (!customer)
          return;


        // Build billing address
        const billingAddress =
          [
            customer.billingAddressLine1,
            customer.billingAddressLine2
          ]
            .filter(Boolean)
            .join(', ');


        // Build shipping address
        const shippingAddress =
          [
            customer.shippingAddressLine1,
            customer.shippingAddressLine2
          ]
            .filter(Boolean)
            .join(', ');



        this.form.patchValue({

          // BASIC
          customerId: customer.id,


          // BILLING
          billingName: customer.customerName,

          billingGSTIN: customer.gstNumber,

          billingState: customer.billingState,

          billingStateCode: customer.billingPincode,

          billingAddress: billingAddress,


          // SHIPPING
          shippingName: customer.shippingName || customer.customerName,

          shippingGSTIN: customer.gstNumber,

          shippingState: customer.shippingState || customer.billingState,

          shippingStateCode:
            customer.shippingPincode || customer.billingPincode,

          shippingAddress:
            shippingAddress || billingAddress

        });


      },

      error: err => {

        console.error("Customer load failed:", err);

      }

    });

}


  // =====================================================
  // CANCEL
  // =====================================================

  cancel(): void {

    this.router.navigate(['/sales/sales-orders']);

  }


}

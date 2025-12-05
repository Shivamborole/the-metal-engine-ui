import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule,FormBuilder, FormGroup, Validators, AbstractControl, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../Services/customer-service';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule,  ReactiveFormsModule,FormsModule],
  templateUrl: './customer-form.html',
  styleUrls: ['./customer-form.scss']
})
export class CustomerFormComponent implements OnInit {
  form!: FormGroup;
  id: string | null = null;
  companyId: string = '';

  constructor(
    private fb: FormBuilder,
    private service: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
  
    this.companyId = localStorage.getItem("selectedCompanyId") || "";

  if (!this.companyId) {
    alert("No company selected! Please select a company first.");
    return;
  }
    
    this.buildForm();
    this.id = this.route.snapshot.paramMap.get('id');

    // TODO: Set companyId via your company-switcher
    // this.companyId = companyContext.getCurrentCompanyId();
    

    if (this.id) {
      this.service.getCustomer(this.id).subscribe(customer => {
        this.form.patchValue(customer);
      });
    }

    // Auto-copy billing → shipping
    this.form.get('shippingSame')?.valueChanges.subscribe(val => {
      if (val) this.copyBillingToShipping();
    });

    
  }

  buildForm() {
    this.form = this.fb.group({
      customerName: ['', Validators.required],
      companyName: [''],
      customerType: ['Individual', Validators.required],

      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      alternatePhone: [''],

      gstNumber: ['', this.gstValidator],
      panNumber: [''],

      billingAddressLine1: ['', Validators.required],
      billingAddressLine2: [''],
      billingCity: ['', Validators.required],
      billingState: ['', Validators.required],
      billingPincode: ['', Validators.required],
      billingCountry: ['India'],

      shippingSame: [true],
      shippingAddressLine1: [''],
      shippingAddressLine2: [''],
      shippingCity: [''],
      shippingState: [''],
      shippingPincode: [''],
      shippingCountry: ['India'],

      creditLimit: [''],
      openingBalance: [0],
      notes: ['']
    });
  }

  copyBillingToShipping() {
    const b = this.form.value;

    this.form.patchValue({
      shippingAddressLine1: b.billingAddressLine1,
      shippingAddressLine2: b.billingAddressLine2,
      shippingCity: b.billingCity,
      shippingState: b.billingState,
      shippingPincode: b.billingPincode,
      shippingCountry: b.billingCountry
    });
  }

  gstValidator(control: AbstractControl) {
    const v = control.value;
    if (!v) return null;

    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
    return regex.test(v) ? null : { invalidGST: true };
  }

  submit() {
    console.log('Entered Submit Button')
    if (this.form.invalid) {
      this.form.markAllAsTouched();
          console.log('err here ')
      return;
    }

    const payload = {
      ...this.form.value,
      companyId: this.companyId
    };

    if (this.id) {
      this.service.updateCustomer(this.id, payload).subscribe(() => {
        this.router.navigate(['/customers']);
      });
    } else {
      this.service.addCustomer(payload).subscribe(() => {
        this.router.navigate(['/customers']);
      });
    }
  }
  
cancel() {
  this.router.navigate(['/customers']);
}
}

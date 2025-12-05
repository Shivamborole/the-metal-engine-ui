import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../Services/product-service';
import { MaterialService } from '../../../Services/material-service';
import { CompanyService } from '../../../Services/company-service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.scss']
})
export class ProductFormComponent implements OnInit {

  form!: FormGroup;
  isEdit = false;
  productId: string | null = null;
  loading = false;
  saving = false;
  error = '';
  companyId = '';

  materials: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private materialService: MaterialService,
    private companyService: CompanyService
  ) { }

  ngOnInit(): void {

    this.buildForm();
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.productId;

    // 🔥 SUBSCRIBE to active company (single source of truth)
    this.companyService.activeCompany$.subscribe(active => {

      if (!active || !active.companyId) {
        this.error = 'No active company selected.';
        return;
      }

      this.companyId = active.companyId;

      // Load materials for selected company
      this.loadMaterials(this.companyId);

      // If editing → load product AFTER companyId is available
      if (this.isEdit && this.productId) {
        this.loadProduct(this.productId);
      }
    });
  }

  // ---------------- FORM ----------------
  buildForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      sku: [''],
      productType: ['Simple', Validators.required],
      hsnOrSac: [''],

      category: ['', Validators.required],
      description: [''],

      unitPrice: [0, Validators.required],
      sellingPrice: [0, Validators.required],
      purchasePrice: [0, Validators.required],
      gstRate: [0, Validators.required],

      sellingUnit: ['PCS', Validators.required],
      isTaxInclusive: [false],
      isActive: [true],

      bomLines: this.fb.array([])
    });
  }

  get bomLines(): FormArray {
    return this.form.get('bomLines') as FormArray;
  }

  // ---------------- MATERIALS ----------------
  loadMaterials(companyId: string) {
    this.materialService.getMaterials(companyId).subscribe({
      next: res => this.materials = res,
      error: () => this.materials = []
    });
  }

  // ---------------- LOAD SINGLE PRODUCT ----------------
  loadProduct(id: string) {
    this.loading = true;

    this.productService.getProduct(id).subscribe({
      next: (res) => {
        this.loading = false;

        this.form.patchValue({
          name: res.name,
          sku: res.sku,
          productType: res.productType,
          hsnOrSac: res.hsnOrSac,
          category: res.category,

          unitPrice: res.unitPrice,
          sellingPrice: res.sellingPrice,
          purchasePrice: res.purchasePrice,
          gstRate: res.gstRate,

          sellingUnit: res.sellingUnit,
          isTaxInclusive: res.isTaxInclusive,
          isActive: res.isActive,

          description: res.description
        });

        if (res.productType === 'BOM') {
          this.loadBOM(id);
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load product';
      }
    });
  }

  loadBOM(id: string) {
    this.productService.getBom(id, this.companyId).subscribe(bom => {
      this.bomLines.clear();

      bom.forEach((b: any) => {
        this.bomLines.push(
          this.fb.group({
            materialId: [b.materialId, Validators.required],
            qtyRequiredPerUnit: [b.qtyRequiredPerUnit, Validators.required],
            wastePercentage: [b.wastePercentage]
          })
        );
      });
    });
  }

  // ---------------- PRODUCT TYPE SWITCH ----------------
  onProductTypeChange() {
    if (this.form.get('productType')?.value !== 'BOM') {
      this.bomLines.clear();
    }
  }

  // ---------------- SAVE ----------------
  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.companyId) {
      alert('No active company selected.');
      return;
    }

    const payload = {
      companyId: this.companyId,
      name: this.form.value.name,
      sku: this.form.value.sku,
      productType: this.form.value.productType,
      category: this.form.value.category,
      hsnOrSac: this.form.value.hsnOrSac,

      unitPrice: this.form.value.unitPrice,
      sellingPrice: this.form.value.sellingPrice,
      purchasePrice: this.form.value.purchasePrice,
      gstRate: this.form.value.gstRate,

      sellingUnit: this.form.value.sellingUnit,
      isTaxInclusive: this.form.value.isTaxInclusive,
      isActive: this.form.value.isActive,
      description: this.form.value.description
    };

    this.saving = true;

    const request$ = this.isEdit
      ? this.productService.updateProduct(this.productId!, payload)
      : this.productService.createProduct(payload);

    request$.subscribe({
      next: (res) => {
        const pid = this.productId || res.id;

        if (this.form.value.productType === 'BOM') {
          this.saveBOM(pid, this.companyId);
        } else {
          this.finish();
        }
      },
      error: () => {
        this.saving = false;
        this.error = 'Failed to save product.';
      }
    });
  }

  saveBOM(productId: string, companyId: string) {
    const bomPayload = this.bomLines.value;

    this.productService.saveBom(productId, companyId, bomPayload).subscribe({
      next: () => this.finish(),
      error: () => {
        alert('Product saved but BOM saving failed.');
        this.finish();
      }
    });
  }

  finish() {
    this.saving = false;
    this.router.navigate(['/products']);
  }

  cancel() {
    this.router.navigate(['/products']);
  }

  // ---------------- BOM: Add Line ----------------
  addBomLine() {
    this.bomLines.push(
      this.fb.group({
        materialId: [null, Validators.required],
        qtyRequiredPerUnit: [1, Validators.required],
        wastePercentage: [0]
      })
    );
  }

  // ---------------- BOM: Remove Line ----------------
  removeBomLine(index: number) {
    this.bomLines.removeAt(index);
  }

}

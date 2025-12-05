import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PdfTemplateService } from '../../../Services/pdf-template-service';

@Component({
  standalone: true,
  selector: 'app-pdf-template-settings',
  templateUrl: './invoice-pdf-template.html',
  styleUrls: ['./invoice-pdf-template.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class InvoicePdfTemplate implements OnInit {

  form!: FormGroup;
  logoPreview: string | null = null;
  qrPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private pdfSettingsService: PdfTemplateService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadSettings();
  }

  buildForm() {
    this.form = this.fb.group({
      logo: [null],
      logoUrl: [''],

      qrCode: [null],
      qrUrl: [''],

      bankName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      ifsc: ['', Validators.required],
      branch: [''],

      footerNote: [''],
      terms: [''],
    });
  }

  // Load settings from backend
  loadSettings() {
    // this.pdfSettingsService.get().subscribe(settings => {
    //   this.form.patchValue(settings);
      
    //   this.logoPreview = settings.logoUrl || null;
    //   this.qrPreview = settings.qrUrl || null;
    // });
  }

  // Upload logo
  onLogoChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.form.patchValue({ logo: file });

    const reader = new FileReader();
    reader.onload = (e: any) => this.logoPreview = e.target.result;
    reader.readAsDataURL(file);
  }

  // Upload QR code
  onQrChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.form.patchValue({ qrCode: file });

    const reader = new FileReader();
    reader.onload = (e: any) => this.qrPreview = e.target.result;
    reader.readAsDataURL(file);
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    Object.keys(this.form.controls).forEach(key => {
      formData.append(key, this.form.get(key)?.value);
    });

    // this.pdfSettingsService.save(formData).subscribe({
    //   next: () => alert("PDF Settings saved successfully"),
    //   error: () => alert("Failed to save PDF settings")
    // });
  }
}

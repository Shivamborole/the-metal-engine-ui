import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

interface PdfTemplateSettings {
  logoUrl?: string | null;
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  upiId: string;
  showQr: boolean;
  footerNote: string;
  termsAndConditions: string;
}

@Component({
  selector: 'app-invoice-pdf-template',
  templateUrl: './invoice-pdf-template.html',
    imports:[CommonModule,
    ReactiveFormsModule,   // REQUIRED
    FormsModule  ],
  styleUrls: ['./invoice-pdf-template.scss']
})
export class InvoicePdfTemplate implements OnInit {
 templateForm!: FormGroup;
  previewModel!: PdfTemplateSettings;
  logoPreviewUrl: string | null = null;
  isSaving = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {

    // --- INITIALIZE FORM ----
    this.templateForm = this.fb.group({
      primaryColor: ['#1f2937'],
      accentColor: ['#6b7280'],
      fontFamily: ['Inter'],

      bankName: [''],
      accountNumber: [''],
      ifscCode: [''],
      branch: [''],
      upiId: [''],
      showQr: [true],

      footerNote: [''],
      termsAndConditions: ['']
    });

    // --- INITIAL PREVIEW MODEL ---
    this.previewModel = {
      logoUrl: null,
      primaryColor: '#1f2937',
      accentColor: '#6b7280',
      fontFamily: 'Inter',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branch: '',
      upiId: '',
      showQr: true,
      footerNote: '',
      termsAndConditions: ''
    };

    // --- SYNC FORM CHANGES TO PREVIEW ---
    this.templateForm.valueChanges.subscribe(value => {
      this.previewModel = {
        ...this.previewModel,
        ...value,
        logoUrl: this.logoPreviewUrl
      };
    });
  }

  // --- HANDLE LOGO UPLOAD ---
  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.logoPreviewUrl = reader.result as string;
      this.previewModel = {
        ...this.previewModel,
        logoUrl: this.logoPreviewUrl
      };
    };

    reader.readAsDataURL(file);
  }

  // --- SAVE TEMPLATE SETTINGS ---
  onSave(): void {
    if (this.templateForm.invalid) return;

    this.isSaving = true;

    const payload = {
      ...this.templateForm.value,
      logoUrl: null // backend handles actual file path
    };

    console.log("Saving PDF Template Settings:", payload);

    // Replace this with API call
    setTimeout(() => {
      this.isSaving = false;
      alert('Template Saved Successfully!');
    }, 600);
  }

  // --- RESET SETTINGS ---
  onReset(): void {
    this.templateForm.reset({
      primaryColor: '#1f2937',
      accentColor: '#6b7280',
      fontFamily: 'Inter',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branch: '',
      upiId: '',
      showQr: true,
      footerNote: '',
      termsAndConditions: ''
    });

    this.logoPreviewUrl = null;

    this.previewModel = {
      ...this.templateForm.value,
      logoUrl: null
    };
  }
}

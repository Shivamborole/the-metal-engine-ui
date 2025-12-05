import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { SettingsService, InvoiceNumberSettings } from '../../../Services/invoice-number-setting';
import { CompanyService } from '../../../Services/company-service';

@Component({
  selector: 'app-invoice-number-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './invoice-number-setting.html',
  styleUrls: ['./invoice-number-setting.scss']
})
export class InvoiceNumberSettingsComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  saving = false;
  error = '';

  currentSettings: InvoiceNumberSettings | null = null;
  previewNextNumber = '';

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.buildForm();

    this.companyService.activeCompany$.subscribe(active => {
      if (!active || !active.companyId) {
        this.error = 'No active company selected.';
        return;
      }
      this.loadSettings(active.companyId);
    });

    this.form.valueChanges.subscribe(() => this.updatePreview());
  }

  private buildForm() {
    this.form = this.fb.group({
      prefix: ['', [Validators.maxLength(20)]],
      suffix: ['', [Validators.maxLength(20)]],
      padding: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      resetFrequency: ['Yearly', Validators.required]
    });
  }

  private loadSettings(companyId: string) {
    this.loading = true;
    this.error = '';

    this.settingsService.getInvoiceNumberSettings(companyId).subscribe({
      next: (res) => {
        this.loading = false;
        this.currentSettings = res;

        this.form.patchValue({
          prefix: res.prefix,
          suffix: res.suffix,
          padding: res.padding,
          resetFrequency: res.resetFrequency
        });

        this.updatePreview();
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load invoice number settings.';
      }
    });
  }

  private updatePreview() {
    if (!this.form) return;

    const prefix = this.form.get('prefix')?.value || '';
    const suffix = this.form.get('suffix')?.value || '';
    const padding = this.form.get('padding')?.value || 5;

    // Just a demo number – next number will be generated server-side
    const next = ((this.currentSettings?.currentNumber ?? 0) + 1)
      .toString()
      .padStart(padding, '0');

    this.previewNextNumber = `${prefix}${next}${suffix}`;
  }

  save() {
    if (!this.currentSettings) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = '';

    const payload = {
      prefix: this.form.value.prefix || '',
      suffix: this.form.value.suffix || '',
      padding: this.form.value.padding,
      resetFrequency: this.form.value.resetFrequency
    };

    this.settingsService
      .updateInvoiceNumberSettings(this.currentSettings.id, payload)
      .subscribe({
        next: () => {
          this.saving = false;
        },
        error: () => {
          this.saving = false;
          this.error = 'Failed to save settings.';
        }
      });
  }
}

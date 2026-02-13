import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  SettingsService,
  InvoiceNumberSettings,
  UpdateInvoiceNumberSettingsRequest,
} from '../../../Services/settings-service';
import { CompanyService } from '../../../Services/company-service';

/**
 * Must match backend enum exactly:
 * 0 = Never
 * 1 = Yearly
 * 2 = Monthly
 */
export enum NumberResetFrequency {
  Never = 0,
  Yearly = 1,
  Monthly = 2,
}
@Component({
  selector: 'app-dc-number',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dc-number.html',
  styleUrl: './dc-number.scss',
})
export class DCNumber implements OnInit {
  form!: FormGroup;
  loading = false;
  saving = false;
  error = '';

  currentSettings!: InvoiceNumberSettings;
  previewNextNumber = '';

  NumberResetFrequency = NumberResetFrequency;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private companyService: CompanyService
  ) { }

  ngOnInit(): void {
    this.buildForm();

    this.companyService.activeCompany$.subscribe((c) => {
      if (!c?.companyId) return;
      this.loadSettings(c.companyId);
    });

    this.form.valueChanges.subscribe(() => {
      if (this.currentSettings) {
        this.updatePreview();
      }
    });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      prefix: ['DC-', Validators.required],
      suffix: [''],
      padding: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      resetFrequency: [
        NumberResetFrequency.Yearly,
        Validators.required,
      ],
    });
  }

  private loadSettings(companyId: string): void {
    this.loading = true;
    this.error = '';

    this.settingsService
      .getDeliveryChallanNumberSettings(companyId)
      .subscribe({
        next: (res) => {
          this.currentSettings = res;

          this.form.patchValue({
            prefix: res.prefix,
            suffix: res.suffix,
            padding: res.padding,
            resetFrequency: res.resetFrequency,
          });

          this.updatePreview();
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load Delivery Challan number settings.';
          this.loading = false;
        },
      });
  }

  private updatePreview(): void {
    if (!this.currentSettings) return;

    const { prefix, suffix, padding, resetFrequency } = this.form.value;

    let baseNumber = this.currentSettings.currentNumber;

    if (resetFrequency !== this.currentSettings.resetFrequency) {
      baseNumber = 0;
    }

    const nextSeq = (baseNumber + 1)
      .toString()
      .padStart(padding, '0');

    this.previewNextNumber = `${prefix}${nextSeq}${suffix}`;
  }

  save(): void {
    if (!this.currentSettings || this.form.invalid) return;

    this.saving = true;
    this.error = '';

    const payload: UpdateInvoiceNumberSettingsRequest = {
      prefix: this.form.value.prefix || '',
      suffix: this.form.value.suffix || '',
      padding: this.form.value.padding,
      resetFrequency: this.form.value.resetFrequency,
    };

    this.settingsService
      .updateDeliveryChallanNumberSettings(this.currentSettings.id, payload)
      .subscribe({
        next: () => {
          this.currentSettings = {
            ...this.currentSettings,
            ...payload,
          };

          this.updatePreview();
          this.saving = false;
        },
        error: () => {
          this.error =
            'Failed to save Delivery Challan number settings.';
          this.saving = false;
        },
      });
  }
}

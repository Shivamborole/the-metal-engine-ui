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



export enum NumberResetFrequency {
  Never = 0,
  Yearly = 1,
  Monthly = 2,
}
@Component({
  selector: 'app-so-number-setting',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './so-number-setting.html',
  styleUrl: './so-number-setting.scss',
})
export class SoNumberSetting implements OnInit {
  form!: FormGroup;
  loading = false;
  saving = false;
  error = '';

  currentSettings!: InvoiceNumberSettings;
  previewNextNumber = '';

  // expose enum to template
  NumberResetFrequency = NumberResetFrequency;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private companyService: CompanyService
  ) {}

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
      prefix: ['SO-', Validators.required],
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

    this.settingsService.getSalesOrderNumberSettings(companyId).subscribe({
      next: (res) => {
        this.currentSettings = res;

        this.form.patchValue({
          prefix: res.prefix,
          suffix: res.suffix,
          padding: res.padding,
          resetFrequency: res.resetFrequency, // numeric enum
        });

        this.updatePreview();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load Sales Order number settings.';
        this.loading = false;
      },
    });
  }

  private updatePreview(): void {
    if (!this.currentSettings) return;

    const prefix = this.form.value.prefix || '';
    const suffix = this.form.value.suffix || '';
    const padding = this.form.value.padding || 5;
    const selectedFrequency = this.form.value.resetFrequency;

    let baseNumber = this.currentSettings.currentNumber;

    // if reset frequency changed, preview should restart
    if (selectedFrequency !== this.currentSettings.resetFrequency) {
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
      resetFrequency:
        this.form.value.resetFrequency as NumberResetFrequency,
    };

    this.settingsService
      .updateSalesOrderNumberSettings(this.currentSettings.id, payload)
      .subscribe({
        next: () => {
          // keep local state in sync
          this.currentSettings = {
            ...this.currentSettings,
            ...payload,
          };

          this.updatePreview();
          this.saving = false;
        },
        error: () => {
          this.error = 'Failed to save Sales Order number settings.';
          this.saving = false;
        },
      });
  }
}

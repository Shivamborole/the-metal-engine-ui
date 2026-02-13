import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_API_URL } from '../Constants';
import { NumberResetFrequency } from '../Invoice/InvoiceNumberSetting/invoice-number-setting/invoice-number-setting';

export interface InvoiceNumberSettings {
  id: string;
  companyId: string;
  prefix: string;
  suffix: string;
  padding: number;
  //resetFrequency: 'Never' | 'Yearly' | 'Monthly';
  currentNumber: number;
  currentYear: number;
  currentMonth?: number | null;
  resetFrequency: NumberResetFrequency;
}



export interface UpdateInvoiceNumberSettingsRequest {
  prefix: string;
  suffix: string;
  padding: number;
  resetFrequency: NumberResetFrequency; // ✅ ENUM, NOT STRING
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private baseUrl = `${BASE_API_URL}/settings`;

  constructor(private http: HttpClient) {}

  // =====================================================
  // INVOICE NUMBER SETTINGS
  // =====================================================

  getInvoiceNumberSettings(companyId: string): Observable<InvoiceNumberSettings> {
    return this.http.get<InvoiceNumberSettings>(
      `${this.baseUrl}/invoice-number?companyId=${companyId}`
    );
  }

  updateInvoiceNumberSettings(
    id: string,
    payload: UpdateInvoiceNumberSettingsRequest
  ): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/invoice-number/${id}`,
      payload
    );
  }

  // =====================================================
  // SALES ORDER NUMBER SETTINGS
  // =====================================================

  getSalesOrderNumberSettings(
    companyId: string
  ): Observable<InvoiceNumberSettings> {
    return this.http.get<InvoiceNumberSettings>(
      `${this.baseUrl}/sales-order-number?companyId=${companyId}`
    );
  }

  updateSalesOrderNumberSettings(
    id: string,
    payload: UpdateInvoiceNumberSettingsRequest
  ): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/sales-order-number/${id}`,
      payload
    );
  }

  // =====================================================
  // DELIVERY CHALLAN NUMBER SETTINGS
  // =====================================================

  getDeliveryChallanNumberSettings(
    companyId: string
  ): Observable<InvoiceNumberSettings> {
    return this.http.get<InvoiceNumberSettings>(
      `${this.baseUrl}/delivery-challan-number?companyId=${companyId}`
    );
  }

  updateDeliveryChallanNumberSettings(
    id: string,
    payload: UpdateInvoiceNumberSettingsRequest
  ): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/delivery-challan-number/${id}`,
      payload
    );
  }
}

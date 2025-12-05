import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_API_URL } from '../Constants';
export interface InvoiceNumberSettings {
  id: string;
  companyId: string;
  prefix: string;
  suffix: string;
  padding: number;
  resetFrequency: 'Never' | 'Yearly' | 'Monthly';
  currentNumber: number;
  currentYear: number;
  currentMonth?: number | null;
}

export interface UpdateInvoiceNumberSettingsRequest {
  prefix: string;
  suffix: string;
  padding: number;
  resetFrequency: 'Never' | 'Yearly' | 'Monthly';
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  //private baseUrl = 'https://localhost:7025/api/settings';
  private baseUrl = `${BASE_API_URL}/settings`;
  constructor(private http: HttpClient) {}

  getInvoiceNumberSettings(companyId: string): Observable<InvoiceNumberSettings> {
    return this.http.get<InvoiceNumberSettings>(
      `${this.baseUrl}/invoice-number?companyId=${companyId}`
    );
  }

  updateInvoiceNumberSettings(
    id: string,
    payload: UpdateInvoiceNumberSettingsRequest
  ): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/invoice-number/${id}`, payload);
  }
 
}

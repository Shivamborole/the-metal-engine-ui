import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_API_URL } from '../Constants';
@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  //private baseUrl = 'https://localhost:7025/api/invoices';
  private baseUrl = `${BASE_API_URL}/invoices`;
  constructor(private http: HttpClient) { }

  // ================================
  // GET ALL INVOICES
  // ================================
  getInvoices(companyId: string, type?: string): Observable<any[]> {
    let url = `${this.baseUrl}?companyId=${companyId}`;

    if (type) {
      url += `&type=${type}`;  // DocumentType filter
    }

    return this.http.get<any[]>(url);
  }

  // ================================
  // GET SINGLE INVOICE
  // ================================
  getInvoice(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // ================================
  // PREVIEW NUMBER (NO INCREMENT)
  // ================================
  previewNextInvoiceNumber(companyId: string): Observable<{ invoiceNumber: string }> {
    return this.http.get<{ invoiceNumber: string }>(
      `${this.baseUrl}/preview-number?companyId=${companyId}`
    );
  }

  // ================================
  // CREATE INVOICE (Final Number Assigned)
  // ================================
  createInvoice(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, data);
  }

  // ================================
  // UPDATE INVOICE
  // ================================
  updateInvoice(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data);
  }

  // ================================
  // DELETE INVOICE
  // ================================
  deleteInvoice(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  // ================================
  // DOWNLOAD PDF
  // ================================
  downloadPdf(id: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/pdf`, {
      responseType: 'blob'
    });
  }

  updatePaymentStatus(id: string, status: number) {
  return this.http.put(`${this.baseUrl}/${id}/payment-status`, { status });
}

convertQuotation(id: string) {
  return this.http.put(`${this.baseUrl}/${id}/convert`, {});
}


}

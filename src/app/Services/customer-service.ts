import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = 'https://localhost:7025/api/Customers';

  constructor(private http: HttpClient) {}

  getCustomers(companyId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?companyId=${companyId}`);
  }


  getCustomer(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  addCustomer(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, data);
  }

  updateCustomer(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data);
  }

  deleteCustomer(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}

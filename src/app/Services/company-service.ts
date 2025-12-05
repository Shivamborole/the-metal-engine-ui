
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
import { BASE_API_URL } from '../../../../invoicing-ui/src/app/Constants';
@Injectable({ providedIn: 'root' })
export class CompanyService {

  // private activeCompanySubject = new BehaviorSubject<any>(null);
  // activeCompany$ = this.activeCompanySubject.asObservable();

  //private baseUrl = 'https://localhost:7025/api/company';
    private baseUrl = `${BASE_API_URL}/company`;
  private apiUrl = 'https://localhost:7025/api/user/companies';
  constructor(private http: HttpClient) { }


  createCompany(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/create`, data);
  }
  getCompanies(): Observable<any[]> {
    return this.http.get<any[]>('https://localhost:7025/api/company/list');
  }
  getUserCompanies(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  deleteCompany(id: string) {
    return this.http.delete(`${this.apiUrl}/companies/${id}`);
  }
  setActiveCompany(companyId: string) {
    return this.http.post(`${this.baseUrl}/set-active`, {
      companyId: companyId
    });
  }
  // Broadcast active company to entire app
  private activeCompanySubject = new BehaviorSubject<any>(null);
  activeCompany$ = this.activeCompanySubject.asObservable();

  setActiveCompanyState(company: { companyId: string, companyName: string }) {
    this.activeCompanySubject.next(company);

    localStorage.setItem("selectedCompanyId", company.companyId);
    localStorage.setItem("selectedCompanyName", company.companyName);
  }
getActiveCompany() {
  return this.http.get(`${this.baseUrl}/active`);
}




}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private baseUrl = 'https://localhost:7025/api/Materials';

  constructor(private http: HttpClient) {}

  getMaterials(companyId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?companyId=${companyId}`);
  }
}

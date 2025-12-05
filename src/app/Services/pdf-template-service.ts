import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfTemplateService {

  private baseUrl = 'https://your-backend-api-url/api/pdf-template';

  constructor(private http: HttpClient) {}

  // Get existing template
  getTemplate(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get`);
  }

  // Upload new template
  uploadTemplate(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload`, formData);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_API_URL } from '../Constants';
@Injectable({ providedIn: 'root' })
export class MenuService {

    private api = `${BASE_API_URL}/menu`;
  //private api = 'https://localhost:7025/api/menu';

  constructor(private http: HttpClient) {}

  getMenu(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }
}

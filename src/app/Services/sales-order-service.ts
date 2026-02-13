import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_API_URL } from '../Constants';


export enum SalesOrderStatus {
  Draft = 0,
  Approved = 1,
  Completed = 2,
  Cancelled = 3
}


export interface SalesOrderListItem {

  id: string;

  salesOrderNumber: string;

  salesOrderDate: string;

  customerName: string;

  totalQty: number;

  status: SalesOrderStatus;

}


export interface SalesOrderDetail {

  id: string;

  salesOrderNumber: string;

  salesOrderDate: string;

  placeOfSupply: string;

  poNumber: string;

  purchaseOrderDate: string;

  customerId: string;

  notes: string;

  billing: {

    name: string;

    gstin: string;

    state: string;

    stateCode: string;

    address: string;

    city: string;

  };

  shipping: {

    name: string;

    gstin: string;

    state: string;

    stateCode: string;

    address: string;

    city: string;

  };

  items: any[];

  grandTotal: number;

}



@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {

  private baseUrl = `${BASE_API_URL}/SalesOrders`;

  constructor(private http: HttpClient) {}



  // =====================================================
  // GET SALES ORDER LIST
  // GET /api/SalesOrders?companyId=xxx
  // =====================================================

  getSalesOrders(companyId: string): Observable<SalesOrderListItem[]> {

    return this.http.get<SalesOrderListItem[]>(

      `${this.baseUrl}?companyId=${companyId}`

    );

  }



  // =====================================================
  // GET SALES ORDER DETAIL
  // GET /api/SalesOrders/{id}?companyId=xxx
  // =====================================================

  getSalesOrder(

    companyId: string,

    salesOrderId: string

  ): Observable<SalesOrderDetail> {

    return this.http.get<SalesOrderDetail>(

      `${this.baseUrl}/${salesOrderId}?companyId=${companyId}`

    );

  }



  // =====================================================
  // CREATE SALES ORDER
  // POST /api/SalesOrders?companyId=xxx
  // =====================================================

  createSalesOrder(

    companyId: string,

    payload: any

  ): Observable<string> {

    return this.http.post<string>(

      `${this.baseUrl}?companyId=${companyId}`,

      payload

    );

  }



  // =====================================================
  // PREVIEW NEXT NUMBER
  // GET /api/SalesOrders/preview-number?companyId=xxx
  // =====================================================

  previewNextSalesOrderNumber(

    companyId: string

  ): Observable<{ salesOrderNumber: string }> {

    return this.http.get<{ salesOrderNumber: string }>(

      `${this.baseUrl}/preview-number?companyId=${companyId}`

    );

  }



}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_API_URL } from '../Constants';

/* ================================
   ENUMS
================================ */

export enum DeliveryChallanStatus {
  Draft = 0,
  Final = 1,
  Cancelled = 2
}

export enum DeliveryChallanType {
  Normal = 0,
  Replacement = 1
}

/* ================================
   LIST DTO
================================ */

export interface DeliveryChallanListItem {
  id: string;
  challanNumber: string;
  challanDate: string;
  salesOrderId: string;
  salesOrderNumber: string;
  customerName: string;
  type: DeliveryChallanType;
  totalQty: number;
  status: DeliveryChallanStatus;
}

/* ================================
   SERVICE
================================ */

@Injectable({
  providedIn: 'root',
})
export class DeliveryChallanService {

  private baseUrl = `${BASE_API_URL}/DeliveryChallans`;

  constructor(private http: HttpClient) {}

  /* ================================
     GET ALL DELIVERY CHALLANS
     (optional SO number filter)
  ================================ */
  getDeliveryChallans(
    companyId: string,
    salesOrderNumber?: string
  ): Observable<DeliveryChallanListItem[]> {

    let url = `${this.baseUrl}?companyId=${companyId}`;

    if (salesOrderNumber) {
      url += `&salesOrderNumber=${encodeURIComponent(salesOrderNumber)}`;
    }

    return this.http.get<DeliveryChallanListItem[]>(url);
  }

  /* ================================
     CREATE DELIVERY CHALLAN
  ================================ */
  createDeliveryChallan(companyId: string, payload: any) {
    return this.http.post(
      `${this.baseUrl}?companyId=${companyId}`,
      payload
    );
  }

  /* ================================
     GET DELIVERY CHALLAN BY ID
     (VIEW / EDIT)
  ================================ */
  getById(id: string) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  /* ================================
     PREVIEW DC NUMBER
  ================================ */
  previewNextChallanNumber(
    companyId: string
  ): Observable<{ challanNumber: string }> {
    return this.http.get<{ challanNumber: string }>(
      `${this.baseUrl}/preview-number?companyId=${companyId}`
    );
  }



  /* ================================
     DELIVERY SUMMARY FOR SALES ORDER
     (used while creating DC)
  ================================ */
  getDeliveredSummary(
    salesOrderId: string
  ): Observable<{ productId: string; deliveredQty: number }[]> {
    return this.http.get<
      { productId: string; deliveredQty: number }[]
    >(`${this.baseUrl}/summary/${salesOrderId}`);
  }

  /* ================================
     CANCEL DELIVERY CHALLAN
  ================================ */
  cancelChallan(id: string) {
    return this.http.post(
      `${this.baseUrl}/${id}/cancel`,
      {}
    );
  }
}

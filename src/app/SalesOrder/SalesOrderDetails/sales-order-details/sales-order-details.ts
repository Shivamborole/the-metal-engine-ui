import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SalesOrderService } from '../../../Services/sales-order-service';
import { DeliveryChallanService } from '../../../Services/delivery-challan-service';
import { Router } from 'lucide-angular';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-sales-order-detail',
  standalone: true,
  imports:[RouterModule,],
  templateUrl: './sales-order-details.html'
})
export class SalesOrderDetailComponent implements OnInit {

  so: any;
  summary: any;

  constructor(
    private route: ActivatedRoute,
    private soService: SalesOrderService,
    private deliveryService: DeliveryChallanService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    //this.soService.getById(id).subscribe(res => this.so = res);
    //this.deliveryService.getSummary(id).subscribe(res => this.summary = res);
  }
}

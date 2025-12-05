
import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../../Services/company-service';
@Component({
  selector: 'app-company-switcher',
  imports: [],
  templateUrl: './company-switcher.html',
  styleUrl: './company-switcher.scss',
})
export class CompanySwitcher implements OnInit {
  companies: any[] = [];
  activeCompanyId: string = '';
activeCompanyName:string ='';
  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.activeCompanyId = localStorage.getItem("selectedCompanyId") || "";

    this.companyService.getUserCompanies().subscribe(res => {
      this.companies = res;
    });
  }

 
setCompany(event: Event) {
  const companyId = (event.target as HTMLSelectElement).value;

  this.activeCompanyId = companyId;
  localStorage.setItem("selectedCompanyId", companyId);

  const selected = this.companies.find(c => c.companyId === companyId);
  this.activeCompanyName = selected?.companyName || "";

  window.location.reload();
}


}
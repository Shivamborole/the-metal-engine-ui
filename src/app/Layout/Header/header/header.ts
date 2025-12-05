import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../Services/auth';
import { ThemeService } from '../../../Services/theme-service';
import { CompanyService } from '../../../Services/company-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit {

  activeCompanyId: string = '';
  activeCompanyName: string = 'No active company selected';
  companies: any[] = [];
  themeMode = 'light';

  constructor(
    private auth: AuthService,
    private companyService: CompanyService,
    public themeService: ThemeService
  ) { }

  ngOnInit(): void {

    // Load active company directly from backend
    this.companyService.getActiveCompany().subscribe((res: any) => {
      if (res) {
        this.activeCompanyId = res.companyId;
        this.activeCompanyName = res.companyName;

        // Broadcast to rest of app
        this.companyService.setActiveCompanyState(res);
      } else {
        this.activeCompanyId = '';
        this.activeCompanyName = 'No active company selected';
      }
    });

    // Listen for state changes after clicking "Use"
    this.companyService.activeCompany$.subscribe(c => {
      if (c) {
        this.activeCompanyId = c.companyId;
        this.activeCompanyName = c.companyName;
      }
    });

    // Theme
    this.themeMode = this.themeService.isDark() ? 'dark' : 'light';
  }


  toggleTheme() {
    this.themeService.toggleTheme();
    this.themeMode = this.themeService.isDark() ? 'dark' : 'light';
  }

  logout() {
    this.auth.logout();
  }
}

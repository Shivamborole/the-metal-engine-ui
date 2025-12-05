import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../Header/header/header';
import { FooterComponent } from '../../Footer/footer/footer';
import {  SidebarComponent } from '../../SideBar/side-bar/side-bar';
import { ThemeService } from '../../../Services/theme-service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [ RouterOutlet, CommonModule,HeaderComponent,SidebarComponent],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss']
})
export class MainLayoutComponent {
  constructor(public theme: ThemeService) {}
}



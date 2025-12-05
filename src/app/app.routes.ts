import { Routes } from '@angular/router';
import { Login } from './Login/login';
import { Dashboard } from './Dashboard/dashboard/dashboard';
import { AuthGuard } from './AuthGaurds/auth-guard';
import { ForgotPasswordComponent } from './ForgetPassword/forgot-password/forgot-password';
import { RegisterComponent } from './RegisterUser/register-user/register-user';
import { MainLayoutComponent } from './Layout/MainLayout/main-layout/main-layout';
import { InvoiceNumberSettingsComponent } from './Invoice/InvoiceNumberSetting/invoice-number-setting/invoice-number-setting';
import { InvoicePdfTemplate } from './PDF_Templates/InvoicePDFTemplate/invoice-pdf-template/invoice-pdf-template';

export const routes: Routes = [

  // ---------------- PUBLIC ROUTES ----------------
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  // ---------------- PROTECTED ROUTES ----------------
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [

      // Dashboard
      { path: 'dashboard', component: Dashboard },

      // Companies
      {
        path: 'companies',
        loadComponent: () =>
          import('./Company/company-list/company-list').then(m => m.CompanyListComponent)
      },
      {
        path: 'companies/add',
        loadComponent: () =>
          import('./Company/add-company/add-company').then(m => m.AddCompanyComponent)
      },

      // Customers
      {
        path: 'customers',
        loadComponent: () =>
          import('./Customers/customer-list/customer-list').then(m => m.CustomerListComponent)
      },
      {
        path: 'customers/add',
        loadComponent: () =>
          import('./Customers/customer-form/customer-form').then(m => m.CustomerFormComponent)
      },
      {
        path: 'customers/edit/:id',
        loadComponent: () =>
          import('./Customers/customer-form/customer-form').then(m => m.CustomerFormComponent)
      },
      {
        path: 'products',
        loadComponent: () =>
          import('../app/Products/ProductList/product-list/product-list').then(m => m.ProductListComponent)
      },
      {
        path: 'products/add',
        loadComponent: () =>
          import('../app/Products/ProductForm/product-form/product-form').then(m => m.ProductFormComponent)
      },
      {
        path: 'products/edit/:id',
        loadComponent: () =>
          import('../app/Products/ProductForm/product-form/product-form').then(m => m.ProductFormComponent)
      },


      // ---------------- INVOICES MODULE ----------------

      // INVOICE LIST
      {
        path: 'sales/invoices',
        loadComponent: () =>
          import('../app/Invoice/InvoiceList/invoice-list/invoice-list').then(m => m.InvoiceList)
      },

      // CREATE INVOICE
      {
        path: 'invoice/new',
        loadComponent: () =>
          import('./Invoice/invoice-form/invoice-form').then(m => m.InvoiceForm)
      },

      // EDIT INVOICE
      {
        path: 'invoice/edit/:id',
        loadComponent: () =>
          import('./Invoice/invoice-form/invoice-form').then(m => m.InvoiceForm)
      },

      {
        path: 'settings',
        children: [
          { path: '', redirectTo: 'invoice-number', pathMatch: 'full' },
          { path: 'invoice-number', component: InvoiceNumberSettingsComponent }
        ]
      },
 {
        path: 'settings/invoice-pdf-template',
        children: [
          { path: '', redirectTo: 'invoice-number', pathMatch: 'full' },
          { path: 'invoice-number', component: InvoicePdfTemplate }
        ]
      },
      // (Add products here later)
    ]
  },

  // ---------------- FALLBACK ----------------
  { path: '**', redirectTo: 'login' }
];

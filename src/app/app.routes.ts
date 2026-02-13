import { Routes } from '@angular/router';
import { Login } from './Login/login';
import { Dashboard } from './Dashboard/dashboard/dashboard';
import { AuthGuard } from './AuthGaurds/auth-guard';
import { ForgotPasswordComponent } from './ForgetPassword/forgot-password/forgot-password';
import { RegisterComponent } from './RegisterUser/register-user/register-user';
import { MainLayoutComponent } from './Layout/MainLayout/main-layout/main-layout';
import { InvoiceNumberSettingsComponent } from './Invoice/InvoiceNumberSetting/invoice-number-setting/invoice-number-setting';
import { InvoicePdfTemplate } from './PDF_Templates/InvoicePDFTemplate/invoice-pdf-template/invoice-pdf-template';
import { CompanyListComponent } from './Company/company-list/company-list';
import { CompanyProfileComponent } from './Company/CompanyProfile/company-profile/company-profile';
import { SoNumberSetting } from './SalesOrder/SOnumberSetting/so-number-setting/so-number-setting';
import { DCNumber } from './DeliveryChallan/DeliveryChallanNumber/dc-number/dc-number';

export const routes: Routes = [

  // PUBLIC ROUTES
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  // PROTECTED ROUTES
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [

      // Dashboard
      { path: 'dashboard', component: Dashboard },

      // -------------- COMPANY ROUTES --------------
      // Company List
      {
        path: 'settings/ComapnyProfile',
        loadComponent: () =>
          import('./Company/company-list/company-list').then(m => m.CompanyListComponent)
      },

      // Create Company → CompanyProfileComponent
      {
        path: 'companies/add',
        loadComponent: () =>
          import('./Company/CompanyProfile/company-profile/company-profile')
            .then(m => m.CompanyProfileComponent)
      },

      // Edit Company
      {
        path: 'companies/edit/:id',
        loadComponent: () =>
          import('./Company/CompanyProfile/company-profile/company-profile')
            .then(m => m.CompanyProfileComponent)
      },

      // View Company
      {
        path: 'companies/view/:id',
        loadComponent: () =>
          import('./Company/CompanyProfile/company-profile/company-profile')
            .then(m => m.CompanyProfileComponent)
      },

      // -------------- CUSTOMERS --------------
      {
        path: 'customers',
        loadComponent: () =>
          import('./Customers/customer-list/customer-list')
            .then(m => m.CustomerListComponent)
      },
      {
        path: 'customers/add',
        loadComponent: () =>
          import('./Customers/customer-form/customer-form')
            .then(m => m.CustomerFormComponent)
      },
      {
        path: 'customers/edit/:id',
        loadComponent: () =>
          import('./Customers/customer-form/customer-form')
            .then(m => m.CustomerFormComponent)
      },

      // -------------- PRODUCTS --------------
      {
        path: 'products',
        loadComponent: () =>
          import('./Products/ProductList/product-list/product-list')
            .then(m => m.ProductListComponent)
      },
      {
        path: 'products/add',
        loadComponent: () =>
          import('./Products/ProductForm/product-form/product-form')
            .then(m => m.ProductFormComponent)
      },
      {
        path: 'products/edit/:id',
        loadComponent: () =>
          import('./Products/ProductForm/product-form/product-form')
            .then(m => m.ProductFormComponent)
      },

      // -------------- INVOICES --------------
      {
        path: 'sales/invoices',
        loadComponent: () =>
          import('./Invoice/InvoiceList/invoice-list/invoice-list')
            .then(m => m.InvoiceList)
      },
      {
        path: 'sales/challans',
        loadComponent: () =>
          import('./DeliveryChallan/DeliveryChallanList/delivery-challan-list')
            .then(m => m.DeliveryChallansComponent)
      },
      {
        path: 'sales/challans/create',
        loadComponent: () =>
          import('./DeliveryChallan/DeliveryChallanCreate/delivery-challan-create/delivery-challan-create')
            .then(m => m.DeliveryChallanCreateComponent)
      },
      {
        path: 'sales/sales-order-list',
        loadComponent: () =>
          import('./SalesOrder/SalesOrderList/sales-order-list/sales-order-list')
            .then(m => m.SalesOrderListComponent)
      },
      {
        path: 'sales/sales-orders/create',
        loadComponent: () =>
          import('./SalesOrder/SalesOrderCreate/sales-order-create/sales-order-create')
            .then(m => m.SalesOrderCreateComponent)
      },

      {
        path: 'invoice/new',
        loadComponent: () =>
          import('./Invoice/invoice-form/invoice-form')
            .then(m => m.InvoiceForm)
      },
      {
        path: 'invoice/edit/:id',
        loadComponent: () =>
          import('./Invoice/invoice-form/invoice-form')
            .then(m => m.InvoiceForm)
      },
      {
        path: 'sales/sales-orders/details/:id',
        loadComponent: () =>
          import('./SalesOrder/SalesOrderCreate/sales-order-create/sales-order-create')
            .then(m => m.SalesOrderCreateComponent)
      },

      // -------------- SETTINGS --------------
      {
        path: 'settings/invoice-number',
        component: InvoiceNumberSettingsComponent
      },
      {
        path: 'settings/SO-number',
        component: SoNumberSetting
      },
      {
        path: 'settings/DC-number',
        component: DCNumber
      },
      {
        path: 'settings/invoice-pdf-template',
        component: InvoicePdfTemplate
      }
    ]
  },

  // FALLBACK
  { path: '**', redirectTo: 'login' }
];


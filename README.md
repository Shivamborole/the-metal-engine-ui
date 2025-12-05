# 🚀 Metal Engine UI – Angular Frontend for Smart Invoicing

Metal Engine UI is the Angular frontend for the Metal Engine invoicing platform — a full-stack system built for CNC laser tube cutting, fabrication, and manufacturing businesses.
It provides a clean, responsive, and production-ready interface for generating invoices, delivery challans, rejection notes, PDFs, and managing company operations.

🌐 Live Demo

🔗 Frontend (Netlify): Coming Soon
🔗 Backend API (Azure): Coming Soon

🧱 Tech Stack
Frontend

Angular 17

TypeScript

SCSS modular styling

Angular Material (if used)

Responsive layout design

Reusable components and services

Backend (Connected)

ASP.NET Core 8 Web API

Entity Framework Core

JWT authentication

Azure App Service hosting

📦 Features

✔ Modern sidebar layout

✔ Login / authentication UI

✔ Create, edit, and manage invoices

✔ Delivery Challan generation

✔ Rejection Note generation

✔ PDF preview + download

✔ Email PDF directly from UI

✔ Dynamic product, customer, and company forms

✔ Form validation

✔ Clean and scalable folder architecture

🗂 Project Structure
src/app/
 ┣ Layout/
 ┃ ┣ SideBar/
 ┣ PDF_Templates/
 ┃ ┣ InvoicePDFTemplate/
 ┃ ┣ DeliveryChallanPDFTemplate/
 ┃ ┣ RejectionNotePDFTemplate/
 ┣ Login/
 ┣ Products/
 ┣ RegisterUser/
 ┣ Services/
 ┃ ┣ customer-service.ts
 ┃ ┣ company-service.ts
 ┃ ┣ auth.ts
 ┣ app.component.*
 ┣ app.module.ts

🔧 Environment Configuration

Update API URL in:

src/environments/environment.ts
src/environments/environment.prod.ts

Example:

export const environment = {
  production: true,
  apiBaseUrl: "https://metalengine-api.azurewebsites.net/api"
};

🏃 Running Locally
Install dependencies:
npm install

Start development server:
ng serve -o

🏗 Build for Production
ng build --configuration production


The output will be inside:

dist/the-metal-engine-ui/


This folder is deployed to Netlify.

☁️ Deployment
Frontend

Hosted for free on Netlify with automatic builds from GitHub.

Backend

Hosted on Azure App Service with GitHub Actions CI/CD.

📬 Email Sending

Invoice PDFs are sent via Brevo SMTP through backend API.

🧑‍💻 Developer

Shivam Borole
Full Stack .NET + Angular Engineer
CNC & Manufacturing Automation Domain

⭐ Want to Support?

Leave a ⭐ on the repo if you like this project!




# InvoicingUi

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

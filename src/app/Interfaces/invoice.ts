export type DocumentType = 'Quotation' | 'Invoice';

export interface InvoiceItem {
  productId?: string | null;
  itemName: string;
  hsnCode: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  gstRate: number;
  saveAsProduct: boolean;
}

export interface CreateInvoice {
  companyId: string;
  customerId: string;
  documentType: DocumentType;
  invoiceDate: string;      // ISO
  dueDate?: string | null;
  referenceNumber?: string;
  placeOfSupply?: string;
  notes?: string;
  termsAndConditions?: string;
  isGstInclusive: boolean;
  items: InvoiceItem[];
}

export interface InvoiceSummary {
  id: string;
  invoiceNumber: string;
  documentType: DocumentType;
  status: string;
  invoiceDate: string;
  customerName: string;
  totalAmount: number;
}

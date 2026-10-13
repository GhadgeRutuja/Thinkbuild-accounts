export interface Permission {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canPrint: boolean;
}

export const MODULES = [
  'DASHBOARD',
  'COA',
  'JOURNAL',
  'PURCHASE',
  'SALES',
  'QUOTATION',
  'PARTY',
  'PAYMENT',
  'RECEIPT',
  'INVENTORY',
  'POS',
  'REPORTS',
  'USERS'
] as const;

export type Module = typeof MODULES[number];
export type Action = 'VIEW' | 'CREATE' | 'EDIT' | 'DELETE' | 'APPROVE' | 'PRINT';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  secureId: string;
  addresses: Address[];
  phones: Phone[];
  emails: Email[];
}

export interface Address {
  id: string;
  type: 'Home' | 'Business' | 'Mailing';
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Phone {
  id: string;
  type: 'Mobile' | 'Home' | 'Work';
  number: string;
  isPrimary: boolean;
}

export interface Email {
  id: string;
  type: 'Personal' | 'Work';
  address: string;
  isPrimary: boolean;
}

export interface FieldConfig {
  uiType: 'input' | 'date' | 'select';
  label: string;
  renderOrder: number;
  placeholder?: string;
  options?: string[];
  queryParam: string;
}

export interface DisplayFieldConfig {
  label: string;
  renderOrder: number;
  accessor: (customer: Customer) => string;
  icon?: React.ReactNode;
}

export interface SearchConfig {
  fields: Record<string, FieldConfig>;
}

export interface DisplayConfig {
  fields: Record<string, DisplayFieldConfig>;
}
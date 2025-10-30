import React, { useState } from 'react';
import { Search, X, MapPin, Phone, Mail, Home, Calendar, User, Briefcase } from 'lucide-react';

interface Address {
  id: string;
  type: 'Home' | 'Business' | 'Other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Phone {
  id: string;
  type: 'Mobile' | 'Home' | 'Business';
  number: string;
  isPrimary: boolean;
}

interface Email {
  id: string;
  type: 'Personal' | 'Business';
  address: string;
  isPrimary: boolean;
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  maritalStatus: string;
  secureId: string;
  addresses: Address[];
  phones: Phone[];
  emails: Email[];
}

interface FieldConfig {
  label: string;
  type: 'text' | 'date' | 'select';
  placeholder?: string;
  options?: string[];
  renderOrder: number;
  queryParam: string;
}

interface DisplayFieldConfig {
  label: string;
  renderOrder: number;
}

interface SearchConfig {
  fields: Record<string, FieldConfig>;
}

interface DisplayConfig {
  fields: Record<string, DisplayFieldConfig>;
}

// Add the missing Alert component (simplified version)
interface AlertProps {
  className?: string;
  children: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({ className, children }) => {
  return (
    <div className={`border rounded-lg p-4 ${className || ''}`}>
      {children}
    </div>
  );
};

interface AlertDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

const AlertDescription: React.FC<AlertDescriptionProps> = ({ className, children }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

// Add the missing FormField component
interface FormFieldProps {
  fieldKey: string;
  config: FieldConfig;
  value: string;
  onChange: (key: string, value: string) => void;
}

const FormField: React.FC<FormFieldProps> = ({ fieldKey, config, value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange(fieldKey, e.target.value);
  };

  if (config.type === 'select' && config.options) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {config.label}
        </label>
        <select
          value={value}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
        >
          <option value="">Select {config.label}</option>
          {config.options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {config.label}
      </label>
      <input
        type={config.type}
        value={value}
        onChange={handleChange}
        placeholder={config.placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
      />
    </div>
  );
};

// Add the missing searchConfig and displayConfig
const searchConfig: SearchConfig = {
  fields: {
    firstName: {
      label: 'First Name',
      type: 'text',
      placeholder: 'Enter first name',
      renderOrder: 1,
      queryParam: 'firstName'
    },
    lastName: {
      label: 'Last Name',
      type: 'text',
      placeholder: 'Enter last name',
      renderOrder: 2,
      queryParam: 'lastName'
    },
    dateOfBirth: {
      label: 'Date of Birth',
      type: 'date',
      renderOrder: 3,
      queryParam: 'dateOfBirth'
    },
    maritalStatus: {
      label: 'Marital Status',
      type: 'select',
      options: ['Single', 'Married', 'Divorced', 'Widowed'],
      renderOrder: 4,
      queryParam: 'maritalStatus'
    }
  }
};

const displayConfig: DisplayConfig = {
  fields: {
    firstName: {
      label: 'First Name',
      renderOrder: 1
    },
    lastName: {
      label: 'Last Name',
      renderOrder: 2
    },
    dateOfBirth: {
      label: 'Date of Birth',
      renderOrder: 3
    },
    maritalStatus: {
      label: 'Marital Status',
      renderOrder: 4
    }
  }
};

const DotGrid: React.FC = () => {
  return (
    <div 
      className="absolute inset-0"
      style={{
        backgroundImage: 'radial-gradient(circle, #afcefeff 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    />
  );
};

interface CustomerModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ customer, isOpen, onClose }) => {
  if (!isOpen || !customer) return null;

  const primaryAddress = customer.addresses.find(addr => addr.type === 'Home') || customer.addresses[0];
  const primaryPhone = customer.phones.find(phone => phone.isPrimary) || customer.phones[0];
  const primaryEmail = customer.emails.find(email => email.isPrimary) || customer.emails[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-6 rounded-t-2xl text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {customer.firstName} {customer.lastName}
              </h2>
              <p className="text-gray-300 flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer ID: {customer.id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Personal Information</span>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Date of Birth</p>
                  <p className="text-sm font-medium">
                    {new Date(customer.dateOfBirth).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Marital Status</p>
                  <p className="text-sm font-medium">{customer.maritalStatus}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Secure ID</p>
                  <p className="text-sm font-medium font-mono">{customer.secureId}</p>
                </div>
              </div>
            </div>

            {/* Primary Contact */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">Primary Contact</span>
              </div>
              <div className="space-y-2">
                {primaryPhone && (
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium">{primaryPhone.number}</p>
                    <p className="text-xs text-gray-400 capitalize">{primaryPhone.type}</p>
                  </div>
                )}
                {primaryEmail && (
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium truncate">{primaryEmail.address}</p>
                    <p className="text-xs text-gray-400 capitalize">{primaryEmail.type}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">Addresses</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {customer.addresses.map((address) => (
                <div key={address.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      address.type === 'Home' ? 'bg-blue-100 text-blue-800' :
                      address.type === 'Business' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {address.type}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{address.street}</p>
                  <p className="text-sm text-gray-600">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* All Phones */}
          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">Phone Numbers</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {customer.phones.map((phone) => (
                <div key={phone.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{phone.number}</p>
                    <p className="text-xs text-gray-500 capitalize">{phone.type}</p>
                  </div>
                  {phone.isPrimary && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* All Emails */}
          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">Email Addresses</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {customer.emails.map((email) => (
                <div key={email.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium truncate">{email.address}</p>
                    <p className="text-xs text-gray-500 capitalize">{email.type}</p>
                  </div>
                  {email.isPrimary && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomerSearchApp: React.FC = () => {
  const [searchParams, setSearchParams] = useState<Record<string, string>>({});
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFieldChange = (key: string, value: string) => {
    setSearchParams(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const queryParts: string[] = [];
      const hasParams = Object.values(searchParams).some(val => val && val.trim());
      
      if (hasParams) {
        Object.entries(searchParams).forEach(([key, value]) => {
          if (value && value.trim()) {
            const config = searchConfig.fields[key];
            if (config) {
              if (key === 'firstName' || key === 'lastName') {
                queryParts.push(`q=${encodeURIComponent(value.trim())}`);
              } else {
                queryParts.push(`${config.queryParam}=${encodeURIComponent(value)}`);
              }
            }
          }
        });
      }

      const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
      const url = `http://localhost:3001/customers${queryString}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      let data = await response.json();
      
      if (hasParams) {
        data = data.filter((customer: Customer) => {
          let matches = true;
          
          if (searchParams.firstName && searchParams.firstName.trim()) {
            matches = matches && customer.firstName.toLowerCase().includes(searchParams.firstName.toLowerCase().trim());
          }
          
          if (searchParams.lastName && searchParams.lastName.trim()) {
            matches = matches && customer.lastName.toLowerCase().includes(searchParams.lastName.toLowerCase().trim());
          }
          
          if (searchParams.dateOfBirth && searchParams.dateOfBirth.trim()) {
            matches = matches && customer.dateOfBirth === searchParams.dateOfBirth;
          }
          
          return matches;
        });
      }
      
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchParams({});
    setCustomers([]);
    setError(null);
    setHasSearched(false);
    setSelectedCustomer(null);
    setIsModalOpen(false);
  };

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const sortedSearchFields = Object.entries(searchConfig.fields)
    .sort(([, a], [, b]) => a.renderOrder - b.renderOrder);

  const sortedDisplayFields = Object.entries(displayConfig.fields)
    .sort(([, a], [, b]) => a.renderOrder - b.renderOrder);

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Simple Dot Grid Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <DotGrid />
      </div>
      {/* Content */}
      <div className="relative" style={{ zIndex: 1 }}>
        {/* Header */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-full border border-gray-200 px-8 py-4 shadow-sm w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 border border-gray-200">
              <Search className="w-4 h-4 text-gray-700" />
              </div>
            <h1 className="text-xl font-semibold text-gray-900">Customer Search</h1>
          </div>
          <p className="text-xs text-gray-500">Find and view customer information</p>
        </div>
      </div>
    </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Search Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              {sortedSearchFields.map(([key, config]) => (
                <FormField
                  key={key}
                  fieldKey={key}
                  config={config}
                  value={searchParams[key] || ''}
                  onChange={handleFieldChange}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                <Search className="w-4 h-4" />
                {loading ? 'Searching...' : 'Search'}
              </button>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertDescription className="text-red-800 text-sm">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Results */}
          {hasSearched && !loading && (
            <div>
              {/* Results Header */}
              {customers.length > 0 && (
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">
                    {customers.length} {customers.length === 1 ? 'result' : 'results'}
                  </p>
                </div>
              )}

              {customers.length === 0 ? (
                <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-12 text-center shadow-sm">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-1">No results found</h3>
                  <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {customers.map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => handleCustomerClick(customer)}
                      className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-all cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900 mb-1">
                            {customer.firstName} {customer.lastName}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>
                              {customer.addresses[0] ? 
                                `${customer.addresses[0].city}, ${customer.addresses[0].state}` 
                                : '—'}
                            </span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          {customer.maritalStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(customer.dateOfBirth).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Phone</p>
                          <p className="text-sm font-medium text-gray-900">
                            {customer.phones.find((p) => p.isPrimary)?.number || '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Email</p>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {customer.emails.find((e) => e.isPrimary)?.address || '—'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Initial State */}
          {!hasSearched && !loading && (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-12 text-center shadow-sm">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1">Start searching</h3>
              <p className="text-sm text-gray-500">Enter search criteria and click Search to find customers</p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Details Modal */}
      <CustomerModal 
        customer={selectedCustomer}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default CustomerSearchApp;
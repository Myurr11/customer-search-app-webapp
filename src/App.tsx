import React, { useState } from 'react';
import { Search, X, MapPin, Phone, Mail, Home, Calendar, User, Briefcase, ArrowRight, Users } from 'lucide-react';

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
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated dots background */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: 'radial-gradient(circle, #90bcfeff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          animation: 'pulseDots 4s ease-in-out infinite'
        }}
      />
      
      {/* Moving dots layer */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, #afcefeff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          animation: 'floatDots 8s ease-in-out infinite'
        }}
      />
      
      {/* Subtle shimmer */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: 'linear-gradient(125deg, transparent 0%, rgba(175, 206, 254, 0.1) 50%, transparent 100%)',
          animation: 'shimmer 12s ease-in-out infinite'
        }}
      />

      <style>{`
        @keyframes pulseDots {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.02);
          }
        }

        @keyframes floatDots {
          0%, 100% {
            transform: translateX(0px) translateY(0px);
          }
          25% {
            transform: translateX(1px) translateY(-1px);
          }
          50% {
            transform: translateX(-0.5px) translateY(1px);
          }
          75% {
            transform: translateX(1px) translateY(0.5px);
          }
        }

        @keyframes shimmer {
          0%, 100% {
            opacity: 0;
            transform: translateX(-100%);
          }
          50% {
            opacity: 0.1;
          }
          100% {
            opacity: 0;
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-5">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {customer.firstName} {customer.lastName}
                </h2>
                <p className="text-slate-300 text-sm flex items-center gap-1.5 mt-0.5">
                  <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs font-mono">
                    ID: {customer.id}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Personal Info & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info Card */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-700">
                <div className="bg-slate-100 p-1.5 rounded">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold">Personal Information</span>
              </div>
              <div className="space-y-3">
                <div className="pb-2 border-b border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Date of Birth</p>
                  <p className="text-sm font-medium">
                    {new Date(customer.dateOfBirth).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="pb-2 border-b border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Marital Status</p>
                  <p className="text-sm font-medium capitalize">{customer.maritalStatus}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Secure ID</p>
                  <p className="text-sm font-mono bg-slate-50 px-2 py-1 rounded border border-slate-200">
                    {customer.secureId}
                  </p>
                </div>
              </div>
            </div>

            {/* Primary Contact Card */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-700">
                <div className="bg-slate-100 p-1.5 rounded">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold">Primary Contact</span>
              </div>
              <div className="space-y-3">
                {primaryPhone && (
                  <div className="pb-2 border-b border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Phone</p>
                    <p className="text-sm font-medium">{primaryPhone.number}</p>
                    <p className="text-xs text-slate-400 capitalize">{primaryPhone.type}</p>
                  </div>
                )}
                {primaryEmail && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Email</p>
                    <p className="text-sm font-medium truncate">{primaryEmail.address}</p>
                    <p className="text-xs text-slate-400 capitalize">{primaryEmail.type}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-700">
              <div className="bg-slate-100 p-1.5 rounded">
                <Home className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold">Addresses</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {customer.addresses.map((address) => (
                <div key={address.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      address.type === 'Home' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                      address.type === 'Business' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {address.type}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-900">{address.street}</p>
                  <p className="text-sm text-slate-600">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phones */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-700">
                <div className="bg-slate-100 p-1.5 rounded">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold">Phone Numbers</span>
              </div>
              <div className="space-y-2">
                {customer.phones.map((phone) => (
                  <div key={phone.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded ${
                        phone.type === 'Mobile' ? 'bg-green-100 text-green-700' :
                        phone.type === 'Home' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{phone.number}</p>
                        <p className="text-xs text-slate-500 capitalize">{phone.type}</p>
                      </div>
                    </div>
                    {phone.isPrimary && (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Emails */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-700">
                <div className="bg-slate-100 p-1.5 rounded">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold">Email Addresses</span>
              </div>
              <div className="space-y-2">
                {customer.emails.map((email) => (
                  <div key={email.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 p-1.5 rounded text-slate-700">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 truncate max-w-[150px]">{email.address}</p>
                        <p className="text-xs text-slate-500 capitalize">{email.type}</p>
                      </div>
                    </div>
                    {email.isPrimary && (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
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
          <p className="text-xs text-gray-500">Find and view customer information (built by Mayur Joshi)</p>
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1.5 rounded-lg">
            <Users className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-sm font-medium text-slate-700">
            {customers.length} {customers.length === 1 ? 'customer found' : 'customers found'}
          </p>
        </div>
        <div className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full border border-slate-200">
          Sorted by relevance
        </div>
      </div>
    )}

    {customers.length === 0 ? (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
          <Search className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No customers found</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          We couldn't find any customers matching your search. Try adjusting your filters or search terms.
        </p>
      </div>
    ) : (
      <div className="space-y-4">
        {customers.map((customer) => (
          <div
            key={customer.id}
            onClick={() => handleCustomerClick(customer)}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:border-slate-300 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md group"
          >
            {/* Header Section */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="bg-slate-100 p-2 rounded-lg border border-slate-200 group-hover:bg-slate-200 transition-colors">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-slate-700 transition-colors">
                    {customer.firstName} {customer.lastName}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>
                      {customer.addresses[0] ? 
                        `${customer.addresses[0].city}, ${customer.addresses[0].state}` 
                        : 'No address'}
                    </span>
                  </div>
                </div>
              </div>
              <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full border border-blue-200 capitalize">
                {customer.maritalStatus}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-1.5 rounded border border-slate-200">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Date of Birth</p>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(customer.dateOfBirth).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-1.5 rounded border border-slate-200">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Phone</p>
                  <p className="text-sm font-medium text-slate-900">
                    {customer.phones.find((p) => p.isPrimary)?.number || '—'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-1.5 rounded border border-slate-200">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-500 mb-0.5">Email</p>
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {customer.emails.find((e) => e.isPrimary)?.address || '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer with ID */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">ID: {customer.id}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 group-hover:text-slate-600 transition-colors">
                <span className="text-xs font-medium">View details</span>
                <ArrowRight className="w-3 h-3" />
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
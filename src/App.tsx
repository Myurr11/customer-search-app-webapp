import React, { useState } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from './components/ui/alert';

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


interface Customer {
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

interface Address {
  id: string;
  type: 'Home' | 'Business' | 'Mailing';
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Phone {
  id: string;
  type: 'Mobile' | 'Home' | 'Work';
  number: string;
  isPrimary: boolean;
}

interface Email {
  id: string;
  type: 'Personal' | 'Work';
  address: string;
  isPrimary: boolean;
}

interface FieldConfig {
  uiType: 'input' | 'date' | 'select';
  label: string;
  renderOrder: number;
  placeholder?: string;
  options?: string[];
  queryParam: string;
}

interface DisplayFieldConfig {
  label: string;
  renderOrder: number;
  accessor: (customer: Customer) => string;
}

interface SearchConfig {
  fields: Record<string, FieldConfig>;
}

interface DisplayConfig {
  fields: Record<string, DisplayFieldConfig>;
}

const searchConfig: SearchConfig = {
  fields: {
    firstName: {
      uiType: 'input',
      label: 'First Name',
      renderOrder: 1,
      placeholder: 'John',
      queryParam: 'firstName'
    },
    lastName: {
      uiType: 'input',
      label: 'Last Name',
      renderOrder: 2,
      placeholder: 'Smith',
      queryParam: 'lastName'
    },
    dateOfBirth: {
      uiType: 'date',
      label: 'Date of Birth',
      renderOrder: 3,
      placeholder: '',
      queryParam: 'dateOfBirth'
    }
  }
};

const displayConfig: DisplayConfig = {
  fields: {
    name: {
      label: 'Name',
      renderOrder: 1,
      accessor: (customer: Customer) => `${customer.firstName} ${customer.lastName}`
    },
    dateOfBirth: {
      label: 'Date of Birth',
      renderOrder: 2,
      accessor: (customer: Customer) => new Date(customer.dateOfBirth).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    },
    primaryPhone: {
      label: 'Phone',
      renderOrder: 3,
      accessor: (customer: Customer) => {
        const primary = customer.phones.find(p => p.isPrimary);
        return primary ? primary.number : '—';
      }
    },
    primaryEmail: {
      label: 'Email',
      renderOrder: 4,
      accessor: (customer: Customer) => {
        const primary = customer.emails.find(e => e.isPrimary);
        return primary ? primary.address : '—';
      }
    },
    maritalStatus: {
      label: 'Status',
      renderOrder: 5,
      accessor: (customer: Customer) => customer.maritalStatus
    }
  }
};


interface FormFieldProps {
  fieldKey: string;
  config: FieldConfig;
  value: string;
  onChange: (key: string, value: string) => void;
}

const FormField: React.FC<FormFieldProps> = ({ fieldKey, config, value, onChange }) => {
  const baseClasses = "w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-400";

  switch (config.uiType) {
    case 'input':
      return (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            {config.label}
          </label>
          <input
            type="text"
            className={baseClasses}
            placeholder={config.placeholder}
            value={value}
            onChange={(e) => onChange(fieldKey, e.target.value)}
          />
        </div>
      );
    
    case 'date':
      return (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            {config.label}
          </label>
          <input
            type="date"
            className={baseClasses}
            value={value}
            onChange={(e) => onChange(fieldKey, e.target.value)}
          />
        </div>
      );
    
    case 'select':
      return (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            {config.label}
          </label>
          <select
            className={baseClasses}
            value={value}
            onChange={(e) => onChange(fieldKey, e.target.value)}
          >
            <option value="">Select {config.label}</option>
            {config.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );
    
    default:
      return null;
  }
};

// ==================== MAIN APP COMPONENT ====================

const CustomerSearchApp: React.FC = () => {
  const [searchParams, setSearchParams] = useState<Record<string, string>>({});
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

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
          <div className="bg-white/90 backdrop-blur-sm rounded-full border border-gray-200 px-8 py-4 shadow-sm inline-block">
            <h1 className="text-xl font-semibold text-gray-900">Customer Search</h1>
            <p className="text-xs text-gray-500 mt-0.5">Find and view customer information</p>
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
                    className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors shadow-sm"
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
                          {customer.phones.find(p => p.isPrimary)?.number || '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {customer.emails.find(e => e.isPrimary)?.address || '—'}
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
    </div>
  );
};

export default CustomerSearchApp;
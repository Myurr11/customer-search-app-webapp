# Customer Search Application

A modern React application built with TypeScript and Tailwind CSS that provides a responsive and user-friendly interface for searching and viewing customer information.

## Features

- **Advanced Search Functionality**: Search customers by:
  - First Name
  - Last Name
  - Date of Birth

- **Real-time Filtering**: Client-side filtering for quick and responsive search results
- **Modern UI Components**: Built using custom components with Tailwind CSS
- **Type Safety**: Full TypeScript support
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Loading States**: Visual feedback during search operations
- **Error Handling**: Graceful error display for failed operations

## Tech Stack

- React 19.1
- TypeScript 5.9
- Tailwind CSS 3.4
- Vite 7.1
- JSON Server (for mock API)
- GSAP (for animations)
- Lucide React (for icons)
- Radix UI (for accessible components)

## Getting Started

1. Install dependencies:
```bash
npm install
```
2. Install JSON Server globally (if not already installed)
```sh
npm install -g json-server
```

3. Setup Mock Server
```sh
json-server --watch db.json --port 3001
```

4. Start the mock API server:
```bash
npm run server
```

5. Start the development server:
```bash
npm run dev
```

6. Build for production:
```bash
npm run build
```

## API

The application uses a mock API powered by JSON Server that provides customer data. The API runs on `http://localhost:3001` and supports the following endpoints:

- `GET /customers`: Returns all customers
- `GET /customers?q={query}`: Search customers by name
- `GET /customers?dateOfBirth={date}`: Filter customers by date of birth

## Data Models

### Customer Interface
```typescript
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
```

### Address Interface
```typescript
interface Address {
  id: string;
  type: 'Home' | 'Business' | 'Mailing';
  street: string;
  city: string;
  state: string;
  zipCode: string;
}
```

### Phone Interface
```typescript
interface Phone {
  id: string;
  type: 'Mobile' | 'Home' | 'Work';
  number: string;
  isPrimary: boolean;
}
```

### Email Interface
```typescript
interface Email {
  id: string;
  type: 'Personal' | 'Work';
  address: string;
  isPrimary: boolean;
}
```

## Configuration

The project uses several configuration files:

- TypeScript: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- Vite: `vite.config.ts`
- Tailwind: `tailwind.config.js`
- ESLint: `eslint.config.js`
- Components: `components.json`

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run server`: Start JSON Server for mock API

### Key Features

1. **Search Form**
   - Input validation
   - Real-time filtering
   - Clear form functionality

2. **Results Display**
   - Responsive grid layout
   - Loading states
   - Error handling
   - No results state

3. **UI Components**
   - Custom Alert component
   - Form fields with labels
   - Responsive cards
   - Icon integration


## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [Lucide Icons](https://lucide.dev)
- [JSON Server](https://github.com/typicode/json-server)
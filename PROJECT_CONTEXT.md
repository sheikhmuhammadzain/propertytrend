# Project Context: Property Trend

This project is a real estate market analytics application designed to provide insights into housing market dynamics, specifically focused on areas like Houston. It enables users to track key indicators such as median prices, sales volume, and inventory levels.

## 🚀 Technology Stack

- **Frontend Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Data Visualization**: Recharts (inferred from chart component structure)
- **API Client**: [Axios](https://axios-http.com/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **State Management**: React Context API (for Authentication)

## 📁 Project Structure

- `src/pages/`: Contains the main application views.
  - `Home/`: The landing dashboard with property tables (SF & Condo).
  - `Charts/`: Comprehensive data visualization page.
  - `Methodology/`: Explanation of data sources and processing logic.
  - `SignIn/`, `SignUp/`, `Verify/`: User authentication flows.
  - `Users/`: User management interface.
- `src/components/`: Reusable UI elements.
  - `charts/`: Specialized chart components (e.g., `HistoricalTrend`, `SalesVolume`, `MedianSalesChart`).
  - `Tables/`: Data tables for Single Family and Condo listings.
  - `ui/`: Base Shadcn UI components.
  - `containers/`: Layout components like `Navbar` and `Footer`.
- `src/services/`: API interaction logic (`apiServices.ts`).
- `src/config/`: Configuration files (e.g., `axiosConfig.ts`).
- `src/context.tsx`: Global authentication context.
- `src/utils/`: Utility functions and API middleware.

## ⚙️ Key Features

- **Market Dashboard**: Interactive filters for City, Year, and Month to view specific market data.
- **Housing Analytics**: Detailed tables comparing "Single Family" and "Condo" properties with metrics like:
  - Pending/Signed Contracts
  - Price Adjustments
  - Sold and Closed listings
  - New Listings
  - DOM (Days on Market)
  - List to Close +/-
  - Total Actives
- **Visual Trends**: Multiple chart types visualizing market behavior over time.
- **AI Chatbot**: Integrated assistant to help users navigate or understand market data.
- **User Authentication**: Secure signup and login process with email activation.

## 🔗 Data Sources & API

- The application fetches data from a backend hosted at `https://www.refinedreport.com/backend/`.
- Market data is indicated to be obtained from the **Houston Association of Realtors (HAR)**.

## 🛠️ Getting Started

1.  **Install Dependencies**: `pnpm install` or `npm install`
2.  **Environment Variables**: Ensure `VITE_API_BASE_URL` is configured if different from the default.
3.  **Run Development Server**: `npm run dev`
4.  **Build**: `npm run build`

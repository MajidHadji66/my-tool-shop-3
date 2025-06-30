# Cascade Tool Shop 
A full-stack web application for managing a tool shop, featuring inventory management, cart, checkout, admin, and contact features. Built with Angular (frontend) and Node.js/Express (backend).

## Features

- **Inventory List**: Browse, filter, and search tools and parts. View item details with images and descriptions.
- **Cart & Checkout**: Add items to cart, view cart, and complete checkout with confirmation.
- **Admin Panel**: Add, edit, delete, and manage inventory items with paging and sorting.
- **Contact Page**: Contact form with confirmation and shop contact info.
- **NgRx Store**: State management for cart using NgRx.
- **REST API**: Node.js/Express backend with CRUD for inventory (JSON file storage).

## Project Structure

```
my-tool-shop-3/
  backend/           # Node.js/Express backend
    index.js         # Main server file
    inventory.json   # Inventory data (JSON)
    package.json     # Backend dependencies
  frontend/          # Angular frontend
    src/app/         # Angular app source
      components/    # Angular components
      services/      # Angular services
      store/         # NgRx store files
    package.json     # Frontend dependencies
    angular.json     # Angular config
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Backend Setup
1. Open a terminal in the `backend` folder.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the backend server:
   ```sh
   npm start
   ```
   The backend runs at `http://localhost:3000`.

### Frontend Setup
1. Open a terminal in the `frontend` folder.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the Angular app:
   ```sh
   npm start
   ```
   The frontend runs at `http://localhost:4200`.

## Development Notes
- Inventory data is stored in `backend/inventory.json` (ignored by git).
- To add descriptions or images, edit `inventory.json` and restart the backend if needed.
- The app uses Angular Material for UI and NgRx for cart state.
- Tests are included for key components and services.

## License
MIT

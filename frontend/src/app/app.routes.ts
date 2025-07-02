import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { AboutComponent } from './components/about.component';
import { ContactComponent } from './components/contact.component';
import { CartComponent } from './components/cart.component';
import { CheckoutComponent } from './components/checkout.component';
import { OrderSummaryComponent } from './components/order-summary.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'inventory',
    loadComponent: () =>
      import('./components/inventory-list/inventory-list').then(
        (m) => m.InventoryList
      ),
  },
  {
    path: 'inventory/:id',
    loadComponent: () =>
      import('./components/inventory-detail/inventory-detail').then(
        (m) => m.InventoryDetail
      ),
  },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-summary', component: OrderSummaryComponent },
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/admin/admin.component').then(
        (m) => m.AdminComponent
      ),
  },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
];

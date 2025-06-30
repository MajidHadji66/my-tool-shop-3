import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { AboutComponent } from './components/about.component';
import { ContactComponent } from './components/contact.component';
import { InventoryList } from './components/inventory-list/inventory-list';
import { CartComponent } from './components/cart.component';
import { CheckoutComponent } from './components/checkout.component';
import { OrderSummaryComponent } from './components/order-summary.component';
import { AdminComponent } from './components/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'inventory', component: InventoryList },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-summary', component: OrderSummaryComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
];

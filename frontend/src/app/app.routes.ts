import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { AboutComponent } from './components/about.component';
import { ContactComponent } from './components/contact.component';
import { InventoryList } from './components/inventory-list/inventory-list';
import { CartComponent } from './components/cart.component';
import { CheckoutComponent } from './components/checkout.component';
import { OrderSummaryComponent } from './components/order-summary.component';
import { AdminComponent } from './components/admin/admin.component';
import { InventoryDetail } from './components/inventory-detail/inventory-detail';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'inventory', component: InventoryList },
  { path: 'inventory/:id', component: InventoryDetail },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-summary', component: OrderSummaryComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
];

import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { InventoryService, InventoryItem } from '../services/inventory';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatSnackBarModule,
    RouterModule,
  ],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  cart: any[] = [];
  constructor(
    private cartService: CartService,
    private inventoryService: InventoryService,
    private snackBar: MatSnackBar
  ) {
    this.cartService.cart$.subscribe((cart) => (this.cart = cart));
  }

  removeOne(item: any) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.cartService.updateCart([...this.cart]);
    } else {
      this.cart = this.cart.filter((i) => i.id !== item.id);
      this.cartService.updateCart([...this.cart]);
    }
    this.inventoryService.getById(item.id).subscribe((inv) => {
      this.inventoryService
        .update(item.id, { quantity: inv.quantity + 1 })
        .subscribe();
    });
    this.snackBar.open(`${item.name} removed from cart`, '', {
      duration: 5000,
      horizontalPosition: 'start',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-success'],
    });
  }

  getTotalQuantity(): number {
    return this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }

  getCartTotal(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}

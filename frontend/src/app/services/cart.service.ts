import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartKey = 'cart';
  private cartSubject = new BehaviorSubject<any[]>(this.getCartFromStorage());
  cart$ = this.cartSubject.asObservable();

  private getCartFromStorage(): any[] {
    const stored = localStorage.getItem(this.cartKey);
    return stored ? JSON.parse(stored) : [];
  }

  getCart(): any[] {
    return this.cartSubject.value;
  }

  getTotalQuantity(): number {
    return this.getCart().reduce((sum, item) => sum + (item.quantity || 1), 0);
  }

  addToCart(item: any) {
    const cart = this.getCart();
    const idx = cart.findIndex((i) => i.id === item.id);
    if (idx > -1) {
      cart[idx].quantity += 1;
      // Always update price in case inventory changed
      cart[idx].price = item.price;
    } else {
      cart.push({ ...item, quantity: 1, price: item.price });
    }
    this.updateCart(cart);
  }

  updateCart(cart: any[]) {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  clearCart() {
    this.updateCart([]);
  }
}

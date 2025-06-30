import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  template: `
    <mat-card style="max-width:600px;margin:2rem auto;">
      <mat-card-title>Order Summary</mat-card-title>
      <mat-card-content *ngIf="order">
        <h4>Order Details</h4>
        <table style="width:100%;margin-bottom:1rem;">
          <tr>
            <th style="text-align:left;">Item</th>
            <th style="text-align:right;">Qty</th>
            <th style="text-align:right;">Price</th>
            <th style="text-align:right;">Total</th>
          </tr>
          <tr *ngFor="let item of order.cartItems">
            <td>{{ item.name }}</td>
            <td style="text-align:right;">{{ item.quantity }}</td>
            <td style="text-align:right;">{{ item.price | currency }}</td>
            <td style="text-align:right;">
              {{ item.price * item.quantity | currency }}
            </td>
          </tr>
          <tr>
            <td colspan="3" style="text-align:right;">
              <strong>Subtotal:</strong>
            </td>
            <td style="text-align:right;">
              <strong>{{ order.total | currency }}</strong>
            </td>
          </tr>
          <tr>
            <td colspan="3" style="text-align:right;">Tax (10%):</td>
            <td style="text-align:right;">{{ order.tax | currency }}</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align:right;">
              <strong>Total:</strong>
            </td>
            <td style="text-align:right;">
              <strong>{{ order.grandTotal | currency }}</strong>
            </td>
          </tr>
        </table>
        <p><strong>Name:</strong> {{ order.buyer.name }}</p>
        <p><strong>Email:</strong> {{ order.buyer.email }}</p>
        <p><strong>Phone:</strong> {{ order.buyer.phone }}</p>
        <p><strong>Address:</strong> {{ order.buyer.address }}</p>
        <p>Your order has been placed successfully.</p>
      </mat-card-content>
      <button mat-raised-button color="primary" [routerLink]="['/']">
        Back to Home
      </button>
    </mat-card>
  `,
})
export class OrderSummaryComponent {
  order: any;
  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.order = nav?.extras?.state?.['order'];
  }
}

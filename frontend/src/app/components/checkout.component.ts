import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, RouterModule],
  template: `
    <mat-card style="max-width:600px;margin:2rem auto;">
      <mat-card-title>Checkout</mat-card-title>
      <mat-card-content>
        <p>Thank you for your purchase!</p>
        <p>Your order has been placed successfully.</p>
      </mat-card-content>
      <button mat-raised-button color="primary" [routerLink]="['/']">
        Back to Home
      </button>
    </mat-card>
  `,
})
export class CheckoutComponent {}

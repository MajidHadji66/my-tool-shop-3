import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
import { CartService } from './services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    RouterModule,
    CommonModule,
    HttpClientModule,
    // FormsModule,
    // MatFormFieldModule,
    // MatInputModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  protected title = 'Cascade Tool Shop';
  cartQuantity = 0;
  private cartSub?: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartSub = this.cartService.cart$.subscribe((cart) => {
      this.cartQuantity = cart.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
      );
    });
  }

  ngOnDestroy() {
    this.cartSub?.unsubscribe();
  }
}

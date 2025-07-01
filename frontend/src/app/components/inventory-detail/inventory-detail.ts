import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InventoryService, InventoryItem } from '../../services/inventory';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../services/cart.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-inventory-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './inventory-detail.html',
  styleUrl: './inventory-detail.scss',
})
export class InventoryDetail implements OnInit {
  item: InventoryItem | undefined;
  adding = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.inventoryService.getById(id).subscribe((item) => (this.item = item));
  }

  addToCart() {
    if (!this.item || this.item.quantity === 0 || this.adding) return;
    this.adding = true;
    this.cartService.addToCart(this.item);
    this.inventoryService
      .update(this.item.id, { quantity: this.item.quantity - 1 })
      .subscribe({
        next: (updated) => {
          if (this.item) this.item.quantity = updated.quantity;
          this.snackBar.open(`${this.item?.name} added to cart`, '', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['snackbar-success'],
          });
          this.adding = false;
        },
        error: () => {
          this.snackBar.open('Failed to add to cart', '', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['snackbar-error'],
          });
          this.adding = false;
        },
      });
  }

  goBack() {
    this.router.navigate(['/inventory']);
  }
}

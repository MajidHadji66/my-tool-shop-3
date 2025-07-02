// ...existing code...
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService, InventoryItem } from '../../services/inventory';
import { CartService } from '../../services/cart.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FilterTypePipe } from './filter-type.pipe';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SortByNamePipe } from './sort-by-name.pipe';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';

import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    RouterModule,
    FormsModule,
    MatInputModule,
  ],
  templateUrl: './inventory-list.html',
  styleUrl: './inventory-list.scss',
})
export class InventoryList implements OnInit {
  onSearch(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: this.searchQuery || null },
      queryParamsHandling: 'merge',
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: null },
      queryParamsHandling: 'merge',
    });
  }
  items: InventoryItem[] = [];
  pagedItems: InventoryItem[] = [];
  pageSize = 15;
  pageIndex = 0;

  searchQuery: string = '';
  isSearchActive = false;

  constructor(
    public inventoryService: InventoryService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['search'] || '';
      this.isSearchActive = !!this.searchQuery;
      this.inventoryService.getAll().subscribe((data: InventoryItem[]) => {
        this.items = data;
        this.setPagedItems();
      });
    });
  }

  setPagedItems() {
    let filtered = this.items;
    if (this.searchQuery) {
      const q = (this.searchQuery ?? '').toLowerCase();
      filtered = this.items.filter(
        (item) =>
          (item.name ?? '').toLowerCase().includes(q) ||
          (item.type ?? '').toLowerCase().includes(q) ||
          (item.location ?? '').toLowerCase().includes(q) ||
          (item.description ?? '').toLowerCase().includes(q)
      );
    }
    // Filter out items with null/empty name or type
    filtered = filtered.filter((item) => !!item.name && !!item.type);
    filtered = filtered.sort((a, b) =>
      (a.name ?? '').localeCompare(b.name ?? '')
    );
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedItems = filtered.slice(start, end);
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.setPagedItems();
  }

  // Type selector and related code removed

  deleteItem(id: number) {
    this.inventoryService.delete(id).subscribe(() => {
      this.items = this.items.filter((item) => item.id !== id);
      this.setPagedItems();
    });
  }

  decrementQuantity(item: InventoryItem) {
    if (item.quantity > 0) {
      this.inventoryService
        .update(item.id, { quantity: item.quantity - 1 })
        .subscribe((updated) => {
          item.quantity = updated.quantity;
        });
    }
  }

  addToCart(item: InventoryItem) {
    if (item.quantity > 0) {
      this.cartService.addToCart(item);
      this.inventoryService
        .update(item.id, { quantity: item.quantity - 1 })
        .subscribe((updated) => {
          item.quantity = updated.quantity;
        });
      this.snackBar.open(`${item.name} added to cart`, '', {
        duration: 5000,
        horizontalPosition: 'start',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-success'],
      });
    }
  }

  // get types() removed
}

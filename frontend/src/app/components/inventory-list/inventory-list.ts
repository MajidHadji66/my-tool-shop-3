import { Component, inject } from '@angular/core';
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
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';

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
    FilterTypePipe,
    MatSnackBarModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    SortByNamePipe,
    MatTableModule,
    MatPaginatorModule,
    RouterModule,
  ],
  templateUrl: './inventory-list.html',
  styleUrl: './inventory-list.scss',
})
export class InventoryList {
  items: InventoryItem[] = [];
  pagedItems: InventoryItem[] = [];
  pageSize = 15;
  pageIndex = 0;

  constructor(
    public inventoryService: InventoryService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {
    this.inventoryService.getAll().subscribe((data: InventoryItem[]) => {
      this.items = data;
      this.setPagedItems();
    });
  }

  setPagedItems() {
    const filtered = this.items
      .filter((item) => !this.selectedType || item.type === this.selectedType)
      .sort((a, b) => a.name.localeCompare(b.name));
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedItems = filtered.slice(start, end);
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.setPagedItems();
  }

  set selectedType(val: string) {
    this._selectedType = val;
    this.pageIndex = 0;
    this.setPagedItems();
  }
  get selectedType(): string {
    return this._selectedType;
  }
  private _selectedType: string = '';

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

  get types(): string[] {
    return Array.from(new Set(this.items.map((item) => item.type)));
  }
}

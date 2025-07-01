import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InventoryService, InventoryItem } from '../../services/inventory';
import { AddInventoryDialogComponent } from './add-inventory-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  username = '';
  password = '';
  loggedIn = false;
  loginError = false;
  items: InventoryItem[] = [];
  pagedItems: InventoryItem[] = [];
  filteredLength = 0;
  pageSize = 15;
  pageIndex = 0;
  addQuantities: { [id: number]: number } = {};
  displayedColumns = [
    'name',
    'location',
    'quantity',
    'Change QTY',
    'type',
    'delete',
  ];

  searchQuery: string = '';
  isSearchActive = false;

  constructor(
    public inventoryService: InventoryService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.loadItems();
  }

  loadItems() {
    this.inventoryService.getAll().subscribe((data: InventoryItem[]) => {
      this.items = data.slice();
      this.setPagedItems();
    });
  }

  onSearch() {
    this.isSearchActive = !!this.searchQuery;
    this.pageIndex = 0;
    this.setPagedItems();
  }

  clearSearch() {
    this.searchQuery = '';
    this.isSearchActive = false;
    this.pageIndex = 0;
    this.setPagedItems();
  }

  setPagedItems() {
    let filtered = this.items;
    if (this.searchQuery) {
      const q = this.searchQuery.trim().toLowerCase();
      // Helper to split a string into words (alphanumeric only), handles undefined
      const getWords = (str: string | undefined) =>
        str
          ? str
              .toLowerCase()
              .split(/[^a-zA-Z0-9]+/)
              .filter((w) => w.length > 0)
          : [];
      const fields = (item: any) => [item.name, item.type, item.location];
      filtered = filtered.filter((item) =>
        fields(item).some((field) => getWords(field).includes(q))
      );
    }
    filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    this.filteredLength = filtered.length;
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedItems = filtered.slice(start, end);
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.setPagedItems();
  }

  login() {
    if (this.username === 'admin' && this.password === '123!@#') {
      this.loggedIn = true;
      this.loginError = false;
      this.loadItems();
    } else {
      this.loginError = true;
    }
  }

  addQuantity(item: InventoryItem) {
    const qty = this.addQuantities[item.id];
    if (qty && qty > 0) {
      this.inventoryService
        .update(item.id, { quantity: item.quantity + qty })
        .subscribe((updated: InventoryItem) => {
          item.quantity = updated.quantity;
          this.addQuantities[item.id] = 0;
        });
    }
  }

  deQuantity(item: InventoryItem) {
    const qty = this.addQuantities[item.id];
    if (qty && qty > 0 && item.quantity - qty >= 0) {
      this.inventoryService
        .update(item.id, { quantity: item.quantity - qty })
        .subscribe((updated: InventoryItem) => {
          item.quantity = updated.quantity;
          this.addQuantities[item.id] = 0;
        });
    }
  }

  deleteItem(item: InventoryItem) {
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '340px',
        data: { name: item.name },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.inventoryService.delete(item.id).subscribe(() => {
            this.items = this.items.filter((i) => i.id !== item.id);
            this.setPagedItems();
            this.snackBar.open('Item deleted.', '', {
              duration: 2500,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['snackbar-success'],
            });
          });
        }
      });
  }

  openAddDialog() {
    this.dialog
      .open(AddInventoryDialogComponent, { width: '420px' })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.inventoryService.add(result).subscribe((newItem: any) => {
            this.items.push(newItem);
            this.items.sort((a, b) => a.name.localeCompare(b.name));
            this.setPagedItems();
            this.snackBar.open('Item added successfully!', '', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['snackbar-success'],
            });
          });
        }
      });
  }
}

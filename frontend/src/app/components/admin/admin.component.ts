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
})
export class AdminComponent {
  username = '';
  password = '';
  loggedIn = false;
  loginError = false;
  items: InventoryItem[] = [];
  pagedItems: InventoryItem[] = [];
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

  constructor(
    public inventoryService: InventoryService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.loadItems();
  }

  loadItems() {
    this.inventoryService.getAll().subscribe((data: InventoryItem[]) => {
      this.items = data.slice().sort((a, b) => a.name.localeCompare(b.name));
      this.setPagedItems();
    });
  }

  setPagedItems() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedItems = this.items.slice(start, end);
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

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { InventoryService, InventoryItem } from '../services/inventory';

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
  ],
  template: `
    <mat-card style="max-width:700px;margin:2rem auto;">
      <mat-card-title>Admin Inventory Management</mat-card-title>
      <div *ngIf="!loggedIn">
        <form (ngSubmit)="login()">
          <mat-form-field style="width:100%">
            <mat-label>Username</mat-label>
            <input matInput [(ngModel)]="username" name="username" required />
          </mat-form-field>
          <mat-form-field style="width:100%">
            <mat-label>Password</mat-label>
            <input
              matInput
              [(ngModel)]="password"
              name="password"
              type="password"
              required
            />
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit">Login</button>
        </form>
        <div *ngIf="loginError" style="color:red;margin-top:8px;">
          Invalid credentials
        </div>
      </div>
      <div *ngIf="loggedIn">
        <table
          mat-table
          [dataSource]="pagedItems"
          style="width:100%;margin-bottom:1rem;"
        >
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Item</th>
            <td mat-cell *matCellDef="let item">{{ item.name }}</td>
          </ng-container>
          <ng-container matColumnDef="quantity">
            <th mat-header-cell *matHeaderCellDef>Current Qty</th>
            <td mat-cell *matCellDef="let item">{{ item.quantity }}</td>
          </ng-container>
          <ng-container matColumnDef="add">
            <th mat-header-cell *matHeaderCellDef>Add Qty</th>
            <td mat-cell *matCellDef="let item">
              <input
                matInput
                type="number"
                min="1"
                [(ngModel)]="addQuantities[item.id]"
                name="addQty-{{ item.id }}"
                style="width:60px;"
              />
              <button mat-button color="primary" (click)="addQuantity(item)">
                Add
              </button>
            </td>
          </ng-container>
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let item">{{ item.type }}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
        <mat-paginator
          [length]="items.length"
          [pageSize]="pageSize"
          [pageSizeOptions]="[15, 30, 50]"
          (page)="onPageChange($event)"
          showFirstLastButtons
        ></mat-paginator>
      </div>
    </mat-card>
  `,
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
  displayedColumns = ['name', 'type', 'quantity', 'add'];

  constructor(public inventoryService: InventoryService) {
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
    if (this.username === 'admin' && this.password === 'admin123') {
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
}

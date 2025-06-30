import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-inventory-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>Add New Item</h2>
    <form
      [formGroup]="form"
      (ngSubmit)="submit()"
      mat-dialog-content
      style="display:flex;flex-direction:column;gap:1rem;min-width:250px;"
    >
      <mat-form-field appearance="outline">
        <mat-label>Name</mat-label>
        <input matInput formControlName="name" required />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Type</mat-label>
        <mat-select formControlName="type" required>
          <mat-option value="tool">Tool</mat-option>
          <mat-option value="part">Part</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Quantity</mat-label>
        <input
          matInput
          type="number"
          formControlName="quantity"
          required
          min="0"
        />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Location</mat-label>
        <input matInput formControlName="location" required />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Price</mat-label>
        <input
          matInput
          type="number"
          formControlName="price"
          required
          min="0"
          step="0.01"
        />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Description</mat-label>
        <textarea matInput formControlName="description"></textarea>
      </mat-form-field>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="close()">Cancel</button>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="form.invalid"
        >
          Add
        </button>
      </mat-dialog-actions>
    </form>
  `,
})
export class AddInventoryDialogComponent {
  form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddInventoryDialogComponent>,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
      location: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      description: [''],
    });
  }
  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
  close() {
    this.dialogRef.close();
  }
}

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
        <mat-select
          formControlName="type"
          (selectionChange)="onTypeChange($event.value)"
        >
          <mat-option *ngFor="let t of types" [value]="t">{{ t }}</mat-option>
          <mat-option value="__custom__">Other (enter new type)</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field *ngIf="customType" appearance="outline">
        <mat-label>New Type</mat-label>
        <input matInput formControlName="newType" required />
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
        <mat-select
          formControlName="location"
          (selectionChange)="onLocationChange($event.value)"
        >
          <mat-option *ngFor="let loc of locations" [value]="loc">{{
            loc
          }}</mat-option>
          <mat-option value="__custom__">Other (enter new location)</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field *ngIf="customLocation" appearance="outline">
        <mat-label>New Location</mat-label>
        <input matInput formControlName="newLocation" required />
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
  locations: string[] = [];
  types: string[] = [];
  customLocation = false;
  customType = false;
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

  ngOnInit() {
    // Get unique locations and types from the inventory service
    let items: any[] = [];
    if ((window as any).inventoryItems) {
      items = (window as any).inventoryItems;
    } else {
      try {
        const openerItems = (window.parent as any).ng?.getComponent(
          document.querySelector('app-admin')
        )?.items;
        if (openerItems) {
          items = openerItems;
        }
      } catch {}
    }
    this.locations = Array.from(
      new Set(items.map((i: any) => i.location).filter((l: string) => !!l))
    );
    this.types = Array.from(
      new Set(items.map((i: any) => i.type).filter((t: string) => !!t))
    );
    this.form.addControl('newLocation', this.fb.control(''));
    this.form.addControl('newType', this.fb.control(''));
    this.form.get('location')?.valueChanges.subscribe((val) => {
      if (val !== '__custom__') {
        this.form.get('newLocation')?.setValue('');
      }
    });
    this.form.get('type')?.valueChanges.subscribe((val) => {
      if (val !== '__custom__') {
        this.form.get('newType')?.setValue('');
      }
    });
  }

  onLocationChange(value: string) {
    this.customLocation = value === '__custom__';
    if (!this.customLocation) {
      this.form.get('newLocation')?.setValue('');
    }
  }

  onTypeChange(value: string) {
    this.customType = value === '__custom__';
    if (!this.customType) {
      this.form.get('newType')?.setValue('');
    }
  }

  submit() {
    if (this.form.valid) {
      const val = this.form.value;
      const location = this.customLocation ? val.newLocation : val.location;
      const type = this.customType ? val.newType : val.type;
      this.dialogRef.close({
        ...val,
        location,
        type,
      });
    }
  }
  close() {
    this.dialogRef.close();
  }
}
// Moved from ../add-inventory-dialog.component.ts

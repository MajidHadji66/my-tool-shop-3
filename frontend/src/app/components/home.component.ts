import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card style="max-width:600px;margin:2rem auto;">
      <mat-card-title>Welcome to Cascade Tool Shop</mat-card-title>
      <mat-card-content>
        <p>
          Manage your tools and parts efficiently. Use the navigation bar to
          view inventory, learn about us, or contact support.
        </p>
      </mat-card-content>
    </mat-card>
  `,
})
export class HomeComponent {}

import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card style="max-width:600px;margin:2rem auto;">
      <mat-card-title>Contact</mat-card-title>
      <mat-card-content>
        <p>
          Contact us at
          <a href="mailto:info&#64;garage-inventory.com"
            >info&#64;garage-inventory.com</a
          >
          or call (555) 123-4567 for support and inquiries.
        </p>
      </mat-card-content>
    </mat-card>
  `,
})
export class ContactComponent {}

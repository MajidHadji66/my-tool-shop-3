import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card style="max-width:600px;margin:2rem auto;">
      <mat-card-title>About Us</mat-card-title>
      <mat-card-content>
        <p>
          We are a dedicated garage shop providing quality tools and parts for
          all your automotive needs. Our mission is to keep your garage running
          smoothly with the best inventory and service.
        </p>
      </mat-card-content>
    </mat-card>
  `,
})
export class AboutComponent {}

import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
  ],
  template: `
    <mat-card style="max-width:600px;margin:2rem auto;">
      <mat-card-title>Contact</mat-card-title>
      <div style="margin-bottom: 1rem;">
        <strong>Phone:</strong> (555) 123-4567<br />
        <strong>Email:</strong>
        <a href="mailto:info&#64;garage-inventory.com"
          >info&#64;garage-inventory.com</a
        >
      </div>
      <mat-card-content *ngIf="!submitted">
        <form #contactForm="ngForm" (ngSubmit)="submitForm()">
          <mat-form-field style="width:100%">
            <mat-label>Name</mat-label>
            <input matInput name="name" [(ngModel)]="contact.name" required />
          </mat-form-field>
          <mat-form-field style="width:100%">
            <mat-label>Email</mat-label>
            <input
              matInput
              name="email"
              [(ngModel)]="contact.email"
              required
              type="email"
            />
          </mat-form-field>
          <mat-form-field style="width:100%">
            <mat-label>Subject</mat-label>
            <input
              matInput
              name="subject"
              [(ngModel)]="contact.subject"
              required
            />
          </mat-form-field>
          <mat-form-field style="width:100%">
            <mat-label>Message</mat-label>
            <textarea
              matInput
              name="message"
              [(ngModel)]="contact.message"
              required
              rows="4"
            ></textarea>
          </mat-form-field>
          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="!contactForm.form.valid"
          >
            Send
          </button>
        </form>
      </mat-card-content>
      <mat-card-content *ngIf="submitted">
        <h3>Thank you for contacting us!</h3>
        <p>Here is a summary of your message:</p>
        <ul>
          <li><strong>Name:</strong> {{ contact.name }}</li>
          <li><strong>Email:</strong> {{ contact.email }}</li>
          <li><strong>Subject:</strong> {{ contact.subject }}</li>
          <li><strong>Message:</strong> {{ contact.message }}</li>
        </ul>
        <p>We will get back to you soon.</p>
      </mat-card-content>
    </mat-card>
  `,
})
export class ContactComponent {
  contact = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };
  submitted = false;

  submitForm() {
    this.submitted = true;
  }
}

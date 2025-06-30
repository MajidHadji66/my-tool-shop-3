import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    RouterModule,
    MatTableModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
  template: `
    <mat-card style="max-width:600px;margin:2rem auto;">
      <mat-card-title>Checkout</mat-card-title>
      <mat-card-content *ngIf="!confirmed">
        <h3>Order Summary</h3>
        <table
          mat-table
          [dataSource]="cartItems"
          style="width:100%;margin-bottom:1rem;"
        >
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef style="text-align:left;">
              Item
            </th>
            <td mat-cell *matCellDef="let item">{{ item.name }}</td>
          </ng-container>
          <ng-container matColumnDef="quantity">
            <th mat-header-cell *matHeaderCellDef style="text-align:right;">
              Qty
            </th>
            <td mat-cell *matCellDef="let item" style="text-align:right;">
              {{ item.quantity }}
            </td>
          </ng-container>
          <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef style="text-align:right;">
              Price
            </th>
            <td mat-cell *matCellDef="let item" style="text-align:right;">
              {{ item.price | currency }}
            </td>
          </ng-container>
          <ng-container matColumnDef="total">
            <th mat-header-cell *matHeaderCellDef style="text-align:right;">
              Total
            </th>
            <td mat-cell *matCellDef="let item" style="text-align:right;">
              {{ item.price * item.quantity | currency }}
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
        <div style="text-align:right;margin-bottom:1rem;">
          <div><strong>Subtotal:</strong> {{ total | currency }}</div>
          <div>Tax (10%): {{ tax | currency }}</div>
          <div><strong>Total:</strong> {{ grandTotal | currency }}</div>
        </div>
        <form #checkoutForm="ngForm" (ngSubmit)="confirmOrder()">
          <mat-form-field style="width:100%">
            <mat-label>Full Name</mat-label>
            <input matInput name="name" [(ngModel)]="buyer.name" required />
          </mat-form-field>
          <mat-form-field style="width:100%">
            <mat-label>Email</mat-label>
            <input
              matInput
              name="email"
              [(ngModel)]="buyer.email"
              required
              type="email"
            />
          </mat-form-field>
          <mat-form-field style="width:100%">
            <mat-label>Phone</mat-label>
            <input matInput name="phone" [(ngModel)]="buyer.phone" required />
          </mat-form-field>
          <mat-form-field style="width:100%">
            <mat-label>Street Address</mat-label>
            <input matInput name="street" [(ngModel)]="buyer.street" required />
          </mat-form-field>
          <mat-form-field style="width:100%">
            <mat-label>City</mat-label>
            <input matInput name="city" [(ngModel)]="buyer.city" required />
          </mat-form-field>
          <mat-form-field style="width:100%">
            <mat-label>State/Province</mat-label>
            <input matInput name="state" [(ngModel)]="buyer.state" required />
          </mat-form-field>
          <mat-form-field style="width:100%">
            <mat-label>Postal Code</mat-label>
            <input matInput name="postal" [(ngModel)]="buyer.postal" required />
          </mat-form-field>
          <mat-form-field style="width:100%">
            <mat-label>Country</mat-label>
            <input
              type="text"
              matInput
              [formControl]="countryControl"
              [matAutocomplete]="auto"
              required
            />
            <mat-autocomplete #auto="matAutocomplete">
              <mat-option
                *ngFor="let country of filteredCountries"
                [value]="country"
              >
                {{ country }}
              </mat-option>
            </mat-autocomplete>
          </mat-form-field>
          <mat-form-field style="width:100%">
            <mat-label>Total (with tax)</mat-label>
            <input
              matInput
              name="total"
              [value]="grandTotal | currency : 'USD' : 'symbol'"
              readonly
            />
          </mat-form-field>
          <button
            mat-button
            color="primary"
            type="submit"
            [disabled]="!checkoutForm.form.valid"
            style="margin-bottom: 24px;"
          >
            Confirm Order
          </button>
        </form>
      </mat-card-content>
      <mat-card-content *ngIf="confirmed">
        <h3>Order Confirmation</h3>
        <h4>Order Summary</h4>
        <table
          mat-table
          [dataSource]="cartItems"
          style="width:100%;margin-bottom:1rem;"
        >
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef style="text-align:left;">
              Item
            </th>
            <td mat-cell *matCellDef="let item">{{ item.name }}</td>
          </ng-container>
          <ng-container matColumnDef="quantity">
            <th mat-header-cell *matHeaderCellDef style="text-align:right;">
              Qty
            </th>
            <td mat-cell *matCellDef="let item" style="text-align:right;">
              {{ item.quantity }}
            </td>
          </ng-container>
          <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef style="text-align:right;">
              Price
            </th>
            <td mat-cell *matCellDef="let item" style="text-align:right;">
              {{ item.price | currency }}
            </td>
          </ng-container>
          <ng-container matColumnDef="total">
            <th mat-header-cell *matHeaderCellDef style="text-align:right;">
              Total
            </th>
            <td mat-cell *matCellDef="let item" style="text-align:right;">
              {{ item.price * item.quantity | currency }}
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
        <div style="text-align:right;margin-bottom:1rem;">
          <div><strong>Subtotal:</strong> {{ total | currency }}</div>
          <div>Tax (10%): {{ tax | currency }}</div>
          <div><strong>Total:</strong> {{ grandTotal | currency }}</div>
        </div>
        <p><strong>Name:</strong> {{ buyer.name }}</p>
        <p><strong>Email:</strong> {{ buyer.email }}</p>
        <p><strong>Phone:</strong> {{ buyer.phone }}</p>
        <p><strong>Street Address:</strong> {{ buyer.street }}</p>
        <p><strong>City:</strong> {{ buyer.city }}</p>
        <p><strong>State/Province:</strong> {{ buyer.state }}</p>
        <p><strong>Postal Code:</strong> {{ buyer.postal }}</p>
        <p><strong>Country:</strong> {{ buyer.country }}</p>
        <p>Your order has been placed successfully.</p>
      </mat-card-content>
      <button mat-raised-button color="primary" [routerLink]="['/']">
        Back to Home
      </button>
    </mat-card>
  `,
})
export class CheckoutComponent implements OnInit {
  buyer = {
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postal: '',
    country: '',
    total: 0,
  };
  confirmed = false;
  cartItems: any[] = [];
  total = 0;
  tax = 0;
  grandTotal = 0;
  displayedColumns = ['name', 'quantity', 'price', 'total'];
  countryControl = new FormControl('');
  countries: string[] = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'Italy',
    'Spain',
    'Netherlands',
    'Sweden',
    'Norway',
    'Denmark',
    'Finland',
    'Switzerland',
    'Austria',
    'Belgium',
    'Ireland',
    'New Zealand',
    'Japan',
    'China',
    'India',
    'Brazil',
    'Mexico',
    'South Africa',
    'Turkey',
    'Russia',
    'Poland',
    'Portugal',
    'Greece',
    'Czech Republic',
    'Hungary',
    'Argentina',
    'Chile',
    'Colombia',
    'South Korea',
    'Singapore',
    'Malaysia',
    'Thailand',
    'Indonesia',
    'Philippines',
    'Vietnam',
    'Saudi Arabia',
    'UAE',
    'Israel',
    'Egypt',
    'Morocco',
    'Nigeria',
    'Kenya',
    'Pakistan',
    'Bangladesh',
    'Ukraine',
    'Romania',
    'Bulgaria',
    'Slovakia',
    'Slovenia',
    'Croatia',
    'Estonia',
    'Latvia',
    'Lithuania',
    'Luxembourg',
    'Iceland',
    'Malta',
    'Cyprus',
    'Qatar',
    'Kuwait',
    'Oman',
    'Bahrain',
    'Jordan',
    'Lebanon',
    'Peru',
    'Venezuela',
    'Uruguay',
    'Ecuador',
    'Paraguay',
    'Bolivia',
    'Costa Rica',
    'Panama',
    'Guatemala',
    'Honduras',
    'El Salvador',
    'Nicaragua',
    'Jamaica',
    'Trinidad and Tobago',
    'Barbados',
    'Bahamas',
    'Dominican Republic',
    'Cuba',
    'Puerto Rico',
    'Greenland',
    'Monaco',
    'Liechtenstein',
    'San Marino',
    'Andorra',
    'Montenegro',
    'Serbia',
    'Macedonia',
    'Albania',
    'Georgia',
    'Armenia',
    'Azerbaijan',
    'Kazakhstan',
    'Uzbekistan',
    'Turkmenistan',
    'Kyrgyzstan',
    'Tajikistan',
    'Mongolia',
    'Cambodia',
    'Laos',
    'Myanmar',
    'Nepal',
    'Sri Lanka',
    'Maldives',
    'Fiji',
    'Papua New Guinea',
    'Solomon Islands',
    'Vanuatu',
    'Samoa',
    'Tonga',
    'Micronesia',
    'Palau',
    'Marshall Islands',
    'Timor-Leste',
    'Brunei',
    'Bhutan',
    'Gabon',
    'Botswana',
    'Namibia',
    'Zimbabwe',
    'Mozambique',
    'Angola',
    'Zambia',
    'Malawi',
    'Tanzania',
    'Uganda',
    'Rwanda',
    'Burundi',
    'Congo',
    'DR Congo',
    'Cameroon',
    'Ivory Coast',
    'Senegal',
    'Mali',
    'Burkina Faso',
    'Niger',
    'Chad',
    'Sudan',
    'South Sudan',
    'Ethiopia',
    'Somalia',
    'Ghana',
    'Togo',
    'Benin',
    'Sierra Leone',
    'Liberia',
    'Guinea',
    'Guinea-Bissau',
    'Gambia',
    'Cape Verde',
    'Mauritania',
    'Seychelles',
    'Comoros',
    'Djibouti',
    'Eritrea',
    'Central African Republic',
    'Equatorial Guinea',
    'Sao Tome and Principe',
    'Lesotho',
    'Swaziland',
    'Madagascar',
    'Mauritius',
    'Reunion',
    'Mayotte',
    'Saint Lucia',
    'Saint Vincent and the Grenadines',
    'Grenada',
    'Antigua and Barbuda',
    'Saint Kitts and Nevis',
    'Dominica',
    'Belize',
    'Suriname',
    'Guyana',
    'French Guiana',
    'Martinique',
    'Guadeloupe',
    'Saint Pierre and Miquelon',
    'Bermuda',
    'Cayman Islands',
    'Turks and Caicos Islands',
    'British Virgin Islands',
    'Anguilla',
    'Montserrat',
    'Aruba',
    'Curacao',
    'Sint Maarten',
    'Bonaire',
    'Saba',
    'Sint Eustatius',
    'Saint Barthelemy',
    'Saint Martin',
    'Greenland',
    'Faroe Islands',
    'Gibraltar',
    'Jersey',
    'Guernsey',
    'Isle of Man',
    'Aland Islands',
    'Vatican City',
    'Holy See',
    'Kosovo',
  ];
  filteredCountries: string[] = this.countries;

  constructor(private cartService: CartService) {
    this.cartItems = this.cartService.getCart();
    this.total = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    this.tax = this.total * 0.1;
    this.grandTotal = this.total + this.tax;
    this.buyer.total = this.grandTotal;
  }

  ngOnInit() {
    this.countryControl.valueChanges.subscribe((value) => {
      const filterValue = value ? value.toLowerCase() : '';
      this.filteredCountries = this.countries.filter((country) =>
        country.toLowerCase().includes(filterValue)
      );
      this.buyer.country = value || '';
    });
  }

  confirmOrder() {
    this.confirmed = true;
    // Prepare order data
    const order = {
      buyer: this.buyer,
      cartItems: this.cartItems,
      total: this.total,
      tax: this.tax,
      grandTotal: this.grandTotal,
    };
    // Clear cart
    this.cartService.clearCart();
    // Navigate to order summary page
    (window as any).ngZone.run(() => {
      // Use Angular's zone to ensure navigation works in standalone
      (window as any).ngZone.injector
        .get('Router')
        .navigate(['/order-summary'], { state: { order } });
    });
  }
}

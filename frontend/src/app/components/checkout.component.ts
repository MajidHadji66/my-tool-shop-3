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
  templateUrl: './checkout.component.html',
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

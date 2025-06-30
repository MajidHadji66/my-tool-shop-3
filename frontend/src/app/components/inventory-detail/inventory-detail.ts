import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InventoryService, InventoryItem } from '../../services/inventory';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-inventory-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
  templateUrl: './inventory-detail.html',
  styleUrl: './inventory-detail.scss',
})
export class InventoryDetail implements OnInit {
  item: InventoryItem | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.inventoryService.getById(id).subscribe((item) => (this.item = item));
  }

  goBack() {
    this.router.navigate(['/inventory']);
  }
}

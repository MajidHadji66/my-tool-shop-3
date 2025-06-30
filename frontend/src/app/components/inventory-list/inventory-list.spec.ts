import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { InventoryList } from './inventory-list';
import { InventoryService } from '../../services/inventory';
import { CartService } from '../../services/cart.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('InventoryList', () => {
  let component: InventoryList;
  let fixture: ComponentFixture<InventoryList>;
  let inventoryServiceSpy: jasmine.SpyObj<InventoryService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;

  const mockItems = [
    {
      id: 1,
      name: 'Hammer',
      type: 'tool',
      quantity: 10,
      location: 'A1',
      price: 12.5,
    },
    {
      id: 2,
      name: 'Wrench',
      type: 'tool',
      quantity: 5,
      location: 'A2',
      price: 8.0,
    },
    {
      id: 3,
      name: 'Bolt',
      type: 'hardware',
      quantity: 20,
      location: 'B1',
      price: 0.5,
    },
  ];

  beforeEach(async () => {
    inventoryServiceSpy = jasmine.createSpyObj('InventoryService', [
      'getAll',
      'delete',
      'update',
    ]);
    cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart']);
    inventoryServiceSpy.getAll.and.returnValue(of(mockItems));
    inventoryServiceSpy.delete.and.returnValue(
      of({
        id: 0,
        name: '',
        type: '',
        quantity: 0,
        location: '',
        price: 0,
      })
    );
    inventoryServiceSpy.update.and.callFake((id, update) => {
      const item = mockItems.find((i) => i.id === id);
      if (item && update.quantity !== undefined)
        item.quantity = update.quantity;
      // Ensure all InventoryItem properties are present and not undefined
      if (item) {
        return of({
          id: item.id,
          name: item.name,
          type: item.type,
          quantity: item.quantity,
          location: item.location,
          price: item.price,
        });
      } else {
        // Fallback: return a default InventoryItem (should not happen in these tests)
        return of({
          id: 0,
          name: '',
          type: '',
          quantity: 0,
          location: '',
          price: 0,
        });
      }
    });

    await TestBed.configureTestingModule({
      imports: [InventoryList, MatSnackBarModule, HttpClientTestingModule],
      providers: [
        { provide: InventoryService, useValue: inventoryServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load and sort items', () => {
    expect(component.items.length).toBe(3);
    expect(component.items[0].name).toBe('Hammer');
  });

  it('should filter items by type', () => {
    component.selectedType = 'tool';
    component.setPagedItems();
    expect(component.pagedItems.every((i) => i.type === 'tool')).toBeTrue();
  });

  it('should page items', () => {
    component.pageSize = 2;
    component.pageIndex = 0;
    component.setPagedItems();
    expect(component.pagedItems.length).toBe(2);
    component.pageIndex = 1;
    component.setPagedItems();
    expect(component.pagedItems.length).toBe(1);
  });

  it('should add to cart and decrease quantity', () => {
    const item = { ...mockItems[0] };
    component.addToCart(item);
    expect(cartServiceSpy.addToCart).toHaveBeenCalledWith(item);
    expect(inventoryServiceSpy.update).toHaveBeenCalled();
  });

  it('should delete item', () => {
    component.deleteItem(1);
    expect(inventoryServiceSpy.delete).toHaveBeenCalledWith(1);
  });

  it('should decrement quantity', () => {
    const item = { ...mockItems[0] };
    const originalQuantity = item.quantity;
    component.decrementQuantity(item);
    expect(inventoryServiceSpy.update).toHaveBeenCalledWith(item.id, {
      quantity: originalQuantity - 1,
    });
    // Simulate the update observable emitting
    inventoryServiceSpy.update.calls
      .mostRecent()
      .returnValue.subscribe((updated: any) => {
        expect(updated.quantity).toBe(originalQuantity - 1);
      });
  });

  it('should return all types', () => {
    const types = component.types;
    expect(types).toContain('tool');
    expect(types).toContain('hardware');
  });
});

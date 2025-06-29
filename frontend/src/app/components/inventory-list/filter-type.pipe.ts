import { Pipe, PipeTransform } from '@angular/core';
import { InventoryItem } from '../../services/inventory';

@Pipe({ name: 'filterType', standalone: true })
export class FilterTypePipe implements PipeTransform {
  transform(items: InventoryItem[], type: string): InventoryItem[] {
    if (!type) return items;
    return items.filter((item) => item.type === type);
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { InventoryItem } from '../../services/inventory';

@Pipe({ name: 'sortByName', standalone: true })
export class SortByNamePipe implements PipeTransform {
  transform(items: InventoryItem[]): InventoryItem[] {
    return items ? [...items].sort((a, b) => a.name.localeCompare(b.name)) : [];
  }
}

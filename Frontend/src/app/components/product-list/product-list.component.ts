import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { SharedStateService } from '../../services/shared-state.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { map, combineLatest } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  private productService = inject(ProductService);
  private sharedState = inject(SharedStateService);

  filteredProducts$ = combineLatest([
    this.productService.products$,
    this.sharedState.searchTerm$
  ]).pipe(
    map(([products, term]) => {
      if (!term) return products;
      const t = term.toLowerCase();
      return products.filter(p => 
        p.name.toLowerCase().includes(t) || 
        p.description.toLowerCase().includes(t)
      );
    })
  );
}

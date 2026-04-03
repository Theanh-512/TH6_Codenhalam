import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedStateService } from '../../services/shared-state.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private sharedState = inject(SharedStateService);
  productService = inject(ProductService);
  
  searchTerm: string = '';

  onSearchChange() {
    this.sharedState.setSearchTerm(this.searchTerm);
  }
}

import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../product.model';
import { ProductService } from '../../services/product.service';
import { SharedStateService } from '../../services/shared-state.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;
  
  public productService = inject(ProductService);
  private sharedState = inject(SharedStateService);

  onDelete() {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.productService.deleteProduct(this.product.id).then(() => {
        this.sharedState.showToast('Đã xóa sản phẩm');
      });
    }
  }

  onEdit() {
    this.sharedState.setEditingProduct(this.product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

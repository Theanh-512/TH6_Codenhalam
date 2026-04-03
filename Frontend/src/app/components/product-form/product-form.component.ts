import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { SharedStateService } from '../../services/shared-state.service';
import { Product } from '../../product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  public productService = inject(ProductService);
  private sharedState = inject(SharedStateService);

  currentProduct: Partial<Product> = { name: '', price: 0, description: '', imageUrl: '' };
  editingProduct: Product | null = null;
  isUploading: boolean = false;
  previewUrl: string | null = null;

  ngOnInit() {
    this.sharedState.editingProduct$.subscribe(product => {
      this.editingProduct = product;
      if (product) {
        this.currentProduct = { ...product };
        this.previewUrl = product.imageUrl;
      } else {
        this.resetForm();
      }
    });
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => this.previewUrl = e.target.result;
    reader.readAsDataURL(file);

    this.isUploading = true;
    try {
      const url = await this.productService.uploadImage(file);
      this.currentProduct.imageUrl = url;
      this.sharedState.showToast('Tải ảnh thành công');
    } catch (err) {
      this.sharedState.showToast('Lỗi khi tải ảnh', true);
    } finally {
      this.isUploading = false;
    }
  }

  async saveProduct() {
    try {
      if (this.editingProduct) {
        await this.productService.updateProduct(this.currentProduct as Product);
        this.sharedState.showToast('Cập nhật thành công');
      } else {
        await this.productService.addProduct(this.currentProduct);
        this.sharedState.showToast('Thêm mới thành công');
      }
      this.resetForm();
      this.sharedState.setEditingProduct(null);
    } catch (err) {
      this.sharedState.showToast('Lỗi khi lưu sản phẩm', true);
    }
  }

  resetForm() {
    this.currentProduct = { name: '', price: 0, description: '', imageUrl: '' };
    this.editingProduct = null;
    this.previewUrl = null;
    this.sharedState.setEditingProduct(null);
  }
}

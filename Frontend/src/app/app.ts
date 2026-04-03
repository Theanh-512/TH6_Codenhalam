import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { SharedStateService } from './services/shared-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ProductFormComponent, ProductListComponent],
  template: `
    <div class="cps-app">
      <app-header></app-header>

      <div class="cps-layout">
        <aside class="cps-side-panel">
          <app-product-form></app-product-form>
        </aside>

        <main class="cps-main-content">
          <app-product-list></app-product-list>
        </main>
      </div>

      <!-- Toast Notification -->
      <div class="cps-toast" *ngIf="sharedState.toast$ | async as toast" [class.error]="toast.isError">
        <i class="fas" [class.fa-check-circle]="!toast.isError" [class.fa-exclamation-circle]="toast.isError"></i>
        {{ toast.message }}
      </div>
    </div>
  `,
  styles: [`
    :host {
      --cps-red: #d70018;
      --cps-bg: #f5f5f5;
      display: block;
      min-height: 100vh;
      background: var(--cps-bg);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }

    .cps-layout {
      max-width: 1400px;
      margin: 15px auto;
      display: grid;
      grid-template-columns: 400px 1fr;
      gap: 15px;
      padding: 0 10px;
    }

    .cps-side-panel {
      position: sticky;
      top: 80px;
      align-self: start;
    }

    .cps-toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      padding: 12px 24px;
      background: #333;
      color: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease;
      z-index: 2000;
      font-size: 14px;
    }

    .cps-toast.error {
      background: var(--cps-red);
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @media (max-width: 1024px) {
      .cps-layout { grid-template-columns: 1fr; }
      .cps-side-panel { position: static; }
    }
  `]
})
export class App {
  sharedState = inject(SharedStateService);
}

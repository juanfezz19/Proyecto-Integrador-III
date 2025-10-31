// src/app/pages/cart/cart.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  shipping: number = 0;
  tax: number = 0;
  total: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems = this.cartService.getItems();
    this.calculateTotals();
  }

  calculateTotals(): void {
    this.subtotal = this.cartService.getTotal();
    this.shipping = this.subtotal >= 100 ? 0 : 10;
    this.tax = this.subtotal * 0.16;
    this.total = this.subtotal + this.shipping + this.tax;
  }

  removeItem(productId: number): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.cartService.removeItem(productId);
      this.loadCart();
    }
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.product.id, item.quantity + 1);
    this.loadCart();
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.product.id, item.quantity - 1);
      this.loadCart();
    }
  }

  clearCart(): void {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
      this.cartService.clearCart();
      this.loadCart();
    }
  }
}
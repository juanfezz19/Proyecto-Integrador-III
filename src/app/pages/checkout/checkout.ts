import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart';
import { CartItem } from '../../models/cart-item';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'] 
})
export class Checkout implements OnInit {
  cartItems: CartItem[] = [];
  subtotal: number = 0; 
  total: number = 0;
  shipping: number = 0;

  // Datos del formulario
  customerInfo = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Colombia'
  };

  paymentMethod: string = 'credit-card';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Escuchar cambios del carrito
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  // ✅ Calcula subtotal, impuestos, envío y total
  calculateTotal(): void {
    this.subtotal = this.cartService.getTotal(); // guarda el subtotal
    const tax = this.subtotal * 0.16;
    this.shipping = this.subtotal > 100 ? 0 : 10;
    this.total = this.subtotal + tax + this.shipping;
  }

  // ✅ Procesar pedido
  processOrder(): void {
    if (this.cartItems.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    if (!this.validateForm()) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    console.log('Procesando pedido...', {
      customer: this.customerInfo,
      items: this.cartItems,
      subtotal: this.subtotal,
      shipping: this.shipping,
      total: this.total,
      paymentMethod: this.paymentMethod
    });

    alert('¡Pedido realizado con éxito!');
    this.cartService.clearCart();
  }

  // ✅ Validación básica del formulario
  validateForm(): boolean {
    return !!(
      this.customerInfo.firstName &&
      this.customerInfo.lastName &&
      this.customerInfo.email &&
      this.customerInfo.phone &&
      this.customerInfo.address &&
      this.customerInfo.city &&
      this.customerInfo.postalCode
    );
  }
}

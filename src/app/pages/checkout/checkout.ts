// src/app/pages/checkout/checkout.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { OrderService, CreateOrderData } from '../../services/order.service';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class Checkout implements OnInit {
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
  
  subtotal: number = 0;
  shipping: number = 0;
  tax: number = 0;
  total: number = 0;

  isProcessing: boolean = false;
  errorMessage: string = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar si está autenticado
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.calculateTotals();
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    const user = this.authService.getUserInfo();
    if (user) {
      this.customerInfo.firstName = user.firstName;
      this.customerInfo.lastName = user.lastName;
      this.customerInfo.email = user.email;
    }
  }

  calculateTotals(): void {
    this.subtotal = this.cartService.getTotal();
    this.shipping = this.subtotal >= 100 ? 0 : 10;
    this.tax = this.subtotal * 0.16;
    this.total = this.subtotal + this.shipping + this.tax;
  }

  processOrder(): void {
    // Validaciones
    if (!this.validateForm()) {
      this.errorMessage = 'Por favor completa todos los campos requeridos';
      return;
    }

    const cartItems = this.cartService.getItems();
    if (cartItems.length === 0) {
      this.errorMessage = 'Tu carrito está vacío';
      return;
    }

    this.isProcessing = true;
    this.errorMessage = '';

    // Preparar datos de la orden
    const orderData: CreateOrderData = {
      items: cartItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      })),
      total: this.total,
      subtotal: this.subtotal,
      tax: this.tax,
      shipping: this.shipping,
      shipping_address: this.customerInfo
    };

    // Crear orden en Supabase
    this.orderService.createOrder(orderData).subscribe({
      next: (orderId) => {
        this.isProcessing = false;
        
        // Limpiar carrito
        this.cartService.clearCart();
        
        // Mostrar mensaje de éxito y redirigir
        alert(`¡Orden #${orderId} creada exitosamente!`);
        this.router.navigate(['/inicio']);
      },
      error: (error) => {
        this.isProcessing = false;
        this.errorMessage = error;
        console.error('Error al procesar la orden:', error);
      }
    });
  }

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
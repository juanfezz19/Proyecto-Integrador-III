// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { Observable, from, map, catchError, switchMap } from 'rxjs';
import { supabase } from '../config/supabase';
import { AuthService } from './auth';

export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
}

export interface CreateOrderData {
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  shipping_address: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface Order {
  id: number;
  user_id: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  status: string;
  shipping_address: any;
  created_at: string;
  items?: OrderItemWithProduct[];
}

export interface OrderItemWithProduct {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    image: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private authService: AuthService) {}

  private getUserId(): string {
    const user = this.authService.getUserInfo();
    if (!user || !user.id) {
      throw new Error('Usuario no autenticado');
    }
    return user.id;
  }

  createOrder(orderData: CreateOrderData): Observable<number> {
    const userId = this.getUserId();

    // Primero crear la orden
    return from(
      supabase.from('orders').insert({
        user_id: userId,
        total: orderData.total,
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        shipping: orderData.shipping,
        status: 'pending',
        shipping_address: orderData.shipping_address
      }).select('id').single()
    ).pipe(
      switchMap(({ data: orderResult, error: orderError }) => {
        if (orderError) throw new Error(orderError.message);
        if (!orderResult) throw new Error('Error al crear la orden');

        const orderId = orderResult.id;

        // Luego insertar los items
        const orderItems = orderData.items.map(item => ({
          order_id: orderId,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        }));

        return from(
          supabase.from('order_items').insert(orderItems)
        ).pipe(
          map(({ error: itemsError }) => {
            if (itemsError) throw new Error(itemsError.message);
            return orderId;
          })
        );
      }),
      catchError((error) => {
        console.error('Error creating order:', error);
        throw error.message || 'Error al crear la orden';
      })
    );
  }

  getUserOrders(): Observable<Order[]> {
    const userId = this.getUserId();

    return from(
      supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            product:products (
              id,
              name,
              image
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message);
        return data as Order[];
      }),
      catchError((error) => {
        console.error('Error fetching orders:', error);
        throw error.message || 'Error al obtener las órdenes';
      })
    );
  }

  getOrderById(orderId: number): Observable<Order> {
    return from(
      supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            product:products (
              id,
              name,
              image
            )
          )
        `)
        .eq('id', orderId)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw new Error(error.message);
        return data as Order;
      }),
      catchError((error) => {
        console.error('Error fetching order:', error);
        throw error.message || 'Error al obtener la orden';
      })
    );
  }
}
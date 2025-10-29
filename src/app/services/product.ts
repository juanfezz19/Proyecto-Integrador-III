import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Laptop Gaming',
      description: 'Laptop de alto rendimiento para gaming',
      price: 1299.99,
      image: 'https://m.media-amazon.com/images/I/81Rnq89BHnL._AC_SX466_.jpg',
      category: 'Electronics',
      rating: 4.5,
      stock: 10
    },
    {
      id: 2,
      name: 'Auriculares Bluetooth',
      description: 'Auriculares inalámbricos con cancelación de ruido',
      price: 199.99,
      image: 'https://m.media-amazon.com/images/I/51+qzpA7y+L._AC_SY300_SX300_QL70_FMwebp_.jpg',
      category: 'Electronics',
      rating: 4.8,
      stock: 25
    },
    {
      id: 3,
      name: 'Smartwatch',
      description: 'Reloj inteligente con múltiples funciones',
      price: 299.99,
      image: 'https://m.media-amazon.com/images/I/61CZSoSnVPL._AC._SR360,460.jpg',
      category: 'Electronics',
      rating: 4.3,
      stock: 15
    },
    // Agregar productos
  ];

  getProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  getProductsByCategory(category: string): Product[] {
    return this.products.filter(p => p.category === category);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product';

interface OfferProduct extends Product {
  originalPrice: number;
  discountPercentage: number;
  offerEndsAt: Date;
}

@Component({
  selector: 'app-ofertas',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './ofertas.html',
  styleUrl: './ofertas.css',
})
export class Ofertas implements OnInit {
  allProducts: Product[] = [];
  offerProducts: OfferProduct[] = [];
  isLoading: boolean = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    // Simular carga de datos
    setTimeout(() => {
      this.allProducts = this.productService.getProducts();
      
      // Convertir algunos productos a ofertas (puedes cambiar esta lógica)
      this.offerProducts = this.createOffers(this.allProducts);
      
      this.isLoading = false;
    }, 500);
  }

  createOffers(products: Product[]): OfferProduct[] {
    // Seleccionar productos aleatoriamente para ofertas
    // Puedes cambiar esta lógica según tus necesidades
    const productsWithOffers = products
      .slice(0, 4) // Tomar los primeros 4 productos como ejemplo
      .map(product => {
        const discountPercentage = this.getRandomDiscount();
        const originalPrice = product.price;
        const discountedPrice = originalPrice * (1 - discountPercentage / 100);
        
        // Fecha de finalización de oferta (7 días desde ahora)
        const offerEndsAt = new Date();
        offerEndsAt.setDate(offerEndsAt.getDate() + 7);

        return {
          ...product,
          price: discountedPrice,
          originalPrice: originalPrice,
          discountPercentage: discountPercentage,
          offerEndsAt: offerEndsAt
        };
      });

    // Retornar array vacío si quieres probar el estado "sin ofertas"
    // return [];
    
    return productsWithOffers;
  }

  getRandomDiscount(): number {
    // Generar descuentos entre 10% y 50%
    const discounts = [10, 15, 20, 25, 30, 35, 40, 50];
    return discounts[Math.floor(Math.random() * discounts.length)];
  }

  getDaysRemaining(endDate: Date): number {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  getHoursRemaining(endDate: Date): number {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60)) % 24;
  }
}
// src/app/pages/servicios/servicios.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  features: string[];
  color: string;
}

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios.html',
  styleUrls: ['./servicios.css']
})
export class ServiciosComponent {
  services: Service[] = [
    {
      id: 1,
      icon: 'truck',
      title: 'Entrega Rápida',
      description: 'Recibe tus productos en tiempo récord con nuestro servicio de entrega express.',
      features: [
        'Entrega en 24-48 horas',
        'Seguimiento en tiempo real',
        'Notificaciones por SMS/Email',
        'Empaque seguro y discreto'
      ],
      color: '#667eea'
    },
    {
      id: 2,
      icon: 'calendar',
      title: 'Entrega Programada',
      description: 'Elige el día y hora exacta que mejor se ajuste a tu disponibilidad.',
      features: [
        'Selecciona fecha y hora',
        'Flexibilidad de horarios',
        'Reprogramación gratuita',
        'Confirmación anticipada'
      ],
      color: '#f59e0b'
    },
    {
      id: 3,
      icon: 'globe',
      title: 'Envíos Internacionales',
      description: 'Llevamos tus productos a cualquier parte del mundo de forma segura.',
      features: [
        'Cobertura a más de 180 países',
        'Gestión aduanera incluida',
        'Seguro de envío gratis',
        'Tiempos competitivos'
      ],
      color: '#10b981'
    },
    {
      id: 4,
      icon: 'refresh',
      title: 'Devoluciones Fáciles',
      description: 'Proceso de devolución simple y sin complicaciones en 30 días.',
      features: [
        'Devoluciones hasta 30 días',
        'Reembolso completo',
        'Recolección a domicilio',
        'Sin preguntas incómodas'
      ],
      color: '#ef4444'
    },
    {
      id: 5,
      icon: 'shield',
      title: 'Garantía Extendida',
      description: 'Protección adicional para tus productos con nuestra garantía extendida.',
      features: [
        'Hasta 3 años de garantía',
        'Cobertura total de daños',
        'Soporte técnico incluido',
        'Reemplazo inmediato'
      ],
      color: '#8b5cf6'
    },
    {
      id: 6,
      icon: 'headset',
      title: 'Soporte 24/7',
      description: 'Asistencia al cliente disponible todos los días, a cualquier hora.',
      features: [
        'Chat en vivo',
        'Soporte telefónico',
        'Email prioritario',
        'Centro de ayuda completo'
      ],
      color: '#06b6d4'
    }
  ];

  benefits = [
    {
      icon: 'check-circle',
      title: 'Calidad Garantizada',
      description: 'Todos nuestros productos cumplen con los más altos estándares de calidad.'
    },
    {
      icon: 'lock',
      title: 'Pago Seguro',
      description: 'Transacciones protegidas con encriptación SSL de última generación.'
    },
    {
      icon: 'award',
      title: 'Mejor Precio',
      description: 'Garantizamos los mejores precios del mercado o te devolvemos la diferencia.'
    },
    {
      icon: 'smile',
      title: '100% Satisfacción',
      description: 'Miles de clientes satisfechos respaldan la calidad de nuestro servicio.'
    }
  ];

  faqs = [
    {
      question: '¿Cuánto tiempo tarda la entrega?',
      answer: 'Las entregas nacionales tardan entre 24-48 horas. Para envíos internacionales, el tiempo varía entre 5-15 días hábiles dependiendo del destino.',
      isOpen: false
    },
    {
      question: '¿Cuál es la política de devoluciones?',
      answer: 'Aceptamos devoluciones hasta 30 días después de la compra. El producto debe estar en su empaque original y en perfectas condiciones.',
      isOpen: false
    },
    {
      question: '¿Cómo puedo rastrear mi pedido?',
      answer: 'Una vez procesado tu pedido, recibirás un número de seguimiento por email. Puedes usar este número en nuestra página de rastreo o en el sitio del transportista.',
      isOpen: false
    },
    {
      question: '¿Ofrecen garantía en los productos?',
      answer: 'Sí, todos nuestros productos incluyen garantía del fabricante. Además, ofrecemos la opción de adquirir garantía extendida de hasta 3 años.',
      isOpen: false
    }
  ];

  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}
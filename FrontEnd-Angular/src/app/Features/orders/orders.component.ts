import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../Core/Services/order.service';
import { Product, Order, OrderItem, PaymentMethod } from '../../Shared/interfaces/order.interface';
import { ICreateOrderRequest, IPayPalConfig, ITransactionItem } from 'ngx-paypal';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  public payPalConfig?: IPayPalConfig;
  public products: Product[] = [];
  public cartItems = new Map<number, number>();
  public selectedPaymentMethod: string = '';
  public loading = false;
  public error: string = '';
  public success: string = '';
  public isPaymentInProgress = false;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.initializePayPalConfig();
    this.loadProducts();
  }


  loadProducts(): void {
    this.loading = true;
    this.orderService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los productos.';
        this.loading = false;
        console.error('Error loading products:', err);
      }
    });
  }

  
  private initializePayPalConfig(): void {
    this.payPalConfig = {
      currency: 'USD', 
      clientId: 'AbMomOqKB-IppfY2O52BuUynvpasIQZ6kUCnPYl6WltrjropJm6L5ua1zzQIkqwzHRlmsoG8TMmzCNeg',
      createOrderOnClient: () => {
        const order: ICreateOrderRequest = {
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: this.convertCOPtoUSD(this.getTotal()).toString(), 
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: this.convertCOPtoUSD(this.getTotal()).toString()
                }
              }
            },
            items: this.getPayPalItems()
          }]
        };
        return order;
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
        color: 'blue'
      },
      onApprove: (data, actions) => {
        console.log('Transaction approved:', data);
        actions.order.capture().then((details:any) => {
          this.handlePayPalSuccess(details);
        });
      },
      onError: (err) => {
        console.error('PayPal Error:', err);
        this.error = 'Error en el proceso de pago. Por favor, intente nuevamente.';
      },
      onCancel: () => {
        this.error = 'Transacción cancelada.';
      }
    };
  }

  private convertCOPtoUSD(copAmount: number): number {
    const exchangeRate = 0.00025;
    return Math.round((copAmount * exchangeRate) * 100) / 100; 
}
private getPayPalItems(): ITransactionItem[] {
  return Array.from(this.cartItems.entries())
    .map(([productId, quantity]) => {
      const product = this.products.find(p => p.id === productId);
      if (!product) return null;
      
      const usdPrice = this.convertCOPtoUSD(product.price);
      
      const item: ITransactionItem = {
        name: product.name,
        quantity: quantity.toString(),
        unit_amount: {
          currency_code: 'USD',
          value: usdPrice.toFixed(2)
        },
        category: 'PHYSICAL_GOODS'
      };
      return item;
    })
    .filter((item): item is ITransactionItem => item !== null);
}

private getOrderItems(): any[] {
  console.log('Products disponibles:', this.products); 
  console.log('Cart items:', this.cartItems); 
  
  const items = Array.from(this.cartItems.entries())
      .map(([productId, quantity]) => {
          const product = this.products.find(p => p.id === productId);
          console.log('Procesando producto:', productId, product); 
          
          if (!product) {
              console.error('Producto no encontrado:', productId);
              return null;
          }
          
          return {
              productId: product.id,
              quantity: quantity,
              price: product.price,
              productName: product.name
          };
      })
      .filter(item => item !== null);

  console.log('Items finales:', items); 
  return items;
}
  

  getQuantity(productId: number): number {
    return this.cartItems.get(productId) || 0;
  }

  updateQuantity(productId: number, change: number): void {
    const currentQuantity = this.getQuantity(productId);
    const newQuantity = currentQuantity + change;
    
    if (newQuantity < 0) return;
    
    if (newQuantity === 0) {
      this.cartItems.delete(productId);
    } else {
      this.cartItems.set(productId, newQuantity);
    }
  }

  getSubtotal(product: Product): number {
    const quantity = this.getQuantity(product.id);
    return product.price * quantity;
  }

  getTotal(): number {
    return Array.from(this.cartItems.entries())
      .reduce((total, [productId, quantity]) => {
        const product = this.products.find(p => p.id === productId);
        if (!product) return total;
        return total + (product.price * quantity);
      }, 0);
  }

  private handlePayPalSuccess(details: any) {
  
    
    this.isPaymentInProgress = true;

    const items = this.getOrderItems();
    console.log('Items a enviar:', items);

    const paypalOrderRequest = {
        orderId: details.id,
        orderDetails: {
            id: details.id,
            status: details.status,
            payerEmail: details.payer.email_address,
            amount: parseFloat(details.purchase_units[0].amount.value),
            currencyCode: details.purchase_units[0].amount.currency_code,
            createTime: details.create_time
        },
        items: items,
        totalAmount: parseFloat(details.purchase_units[0].amount.value)
    };

    console.log('Request completo a enviar:', JSON.stringify(paypalOrderRequest, null, 2));

    this.orderService.processPaypalOrder(paypalOrderRequest).subscribe({
        next: (response) => {
            console.log('Orden procesada:', response);
            this.success = '¡Pago exitoso! Su orden ha sido procesada.';
            this.cartItems.clear();
            this.isPaymentInProgress = false;
        },
        error: (err) => {
            console.error('Error completo:', err);
            console.error('Error status:', err.status);
            console.error('Error mensaje:', err.error);
            console.error('Error detalles:', JSON.stringify(err.error));
            this.error = `Error al procesar la orden: ${err.error?.message || 'Por favor, contacte a soporte.'}`;
            this.isPaymentInProgress = false;
        }
    });
}


  getProductImage(productId: number): string {
    const imagePath = `/orders/cereal${productId}.jpeg`;
    return imagePath;
  }

  onPaymentMethodChange(): void {
    this.error = '';
    this.success = '';
  }

  createOrder(): void {
    if (this.selectedPaymentMethod !== 'CASH_ON_DELIVERY') return;

    const order: Order = {
      totalAmount: this.getTotal(),
      items: this.getOrderItems(),
      paymentMethod: PaymentMethod.Cash
    };

    this.loading = true;
    this.orderService.createOrder(order).subscribe({
      next: (response) => {
        this.success = '¡Orden creada exitosamente!';
        this.cartItems.clear();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al crear la orden. Por favor, intente nuevamente.';
        this.loading = false;
        console.error('Error creating order:', err);
      }
    });
  
  }
}
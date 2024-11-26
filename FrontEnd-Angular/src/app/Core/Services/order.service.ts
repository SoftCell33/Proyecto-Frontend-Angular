import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Product, Order, OrderHistory } from '../../Shared/interfaces/order.interface';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly API_URL = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/products`);
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.API_URL, order);
  }

  getOrderHistory(): Observable<OrderHistory[]> {
    return this.http.get<OrderHistory[]>(`${this.API_URL}/my-orders`);
  }

  getPaymentMethods(): Observable<any> {
    return this.http.get(`${this.API_URL}/payment-methods`);
  }
  processPaypalOrder(orderRequest: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/process-paypal`, orderRequest);
  }
}

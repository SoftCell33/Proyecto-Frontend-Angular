import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesRoutingModule } from './features-routing.module';
import { InitComponent } from './init/init.component';
import { ComponentsModule } from '../Components/components.module';
import { InfoComponent } from './info/info.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { OrdersComponent } from './orders/orders.component';
import { NgxPayPalModule } from 'ngx-paypal';




@NgModule({
  declarations: [
    InitComponent,
    InfoComponent,
    LoginComponent,
    RegisterComponent,
    OrdersComponent,

  ],
  imports: [
    CommonModule,
    FeaturesRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPayPalModule
  ],
  exports:[
    OrdersComponent
  ]
})
export class FeaturesModule { }

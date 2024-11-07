import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeaturesRoutingModule } from './features-routing.module';
import { InitComponent } from './init/init.component';
import { ComponentsModule } from '../Components/components.module';


@NgModule({
  declarations: [
    InitComponent
  ],
  imports: [
    CommonModule,
    FeaturesRoutingModule,
    ComponentsModule,
  ],
})
export class FeaturesModule { }

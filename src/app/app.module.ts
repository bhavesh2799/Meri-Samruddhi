import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { HttpClientModule,  } from  '@angular/common/http';


import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import {environment} from '../environments/environment.prod';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,AngularFireAuthModule,HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),AngularFireStorageModule,
    AngularFirestoreModule,HttpClientModule,IonicSelectableModule, IonicModule.forRoot(), AppRoutingModule,],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}

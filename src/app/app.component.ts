import { Component, OnInit } from '@angular/core';
import {registerWebPlugin} from "@capacitor/core";
import {OAuth2Client} from '@byteowls/capacitor-oauth2';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor() {}
  ngOnInit(){
    registerWebPlugin(OAuth2Client);
  }
}

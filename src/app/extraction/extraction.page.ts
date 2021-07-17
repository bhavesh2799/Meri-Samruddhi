import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingController, ToastController } from '@ionic/angular';
import qs from 'qs'
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import * as XLSX from 'xlsx';
import {
  Plugins
} from '@capacitor/core';
import { Router, RouterLink } from '@angular/router';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-extraction',
  templateUrl: 'extraction.page.html',
  styleUrls: ['extraction.page.scss'],
})
export class ExtractionPage {
  loading:any;
  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please Wait...',
      
    });
    await this.loading.present();
  }
  refreshToken: string;
  oauth2Options = {
    authorizationBaseUrl: "https://accounts.google.com/o/oauth2/auth",
    accessTokenEndpoint: "https://www.googleapis.com/oauth2/v4/token",
    scope: "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file",
    web: {
      appId: '501850242526-rl9ke0kn60rubca0l12qvj3804md6s35.apps.googleusercontent.com',
      responseType: "token", // implicit flow
      accessTokenEndpoint: "", // clear the tokenEndpoint as we know that implicit flow gets the accessToken from the authorizationRequest
      redirectUrl: "https://meri-samruddhi.web.app/extraction/",
      windowOptions: "height=600,left=0,top=0"
    },
    android: {
      appId: '501850242526-aoani6sqosqdqe2u9l0f56hu35qb71a6.apps.googleusercontent.com',
      responseType: "code", // if you configured a android app in google dev console the value must be "code"
      redirectUrl: "com.form.backend:/" // package name from google dev console
    },
   
  }
  oauth2RefreshOptions = {
    authorizationBaseUrl: "https://accounts.google.com/o/oauth2/auth",
    accessTokenEndpoint: "https://www.googleapis.com/oauth2/v4/token",
    scope: "email profile",
    web: {
      appId: '501850242526-rl9ke0kn60rubca0l12qvj3804md6s35.apps.googleusercontent.com',
      responseType: "token", // implicit flow
      accessTokenEndpoint: "", // clear the tokenEndpoint as we know that implicit flow gets the accessToken from the authorizationRequest
      redirectUrl: "https://meri-samruddhi.web.app/extraction/",
      windowOptions: "height=600,left=0,top=0"
    },
    android: {
      appId: '',
      responseType: "code", // if you configured a android app in google dev console the value must be "code"
      redirectUrl: "com.companyname.appname:/" // package name from google dev console
    },
   
  }

  onOAuthBtnClick() {
      Plugins.OAuth2Client.authenticate(
          this.oauth2Options
      ).then(response => {
          // let accessToken = response["access_token"];
          this.refreshToken = response["access_token"];

          // only if you include a resourceUrl protected user values are included in the response!
          let oauthUserId = response["id"];
          let name = response["name"];

          // go to backend
      }).then(()=>{
        console.log('Access token from oauth: ',this.refreshToken )
        this.getData();
      }).catch(reason => {
          console.error("OAuth rejected", reason);
      });
  }

  // Refreshing tokens only works on iOS/Android for now
  onOAuthRefreshBtnClick() {
    if (!this.refreshToken) {
      console.error("No refresh token found. Log in with OAuth first.");
    }

    Plugins.OAuth2Client.refreshToken(
      this.oauth2RefreshOptions
    ).then(response => {
      let accessToken = response["access_token"];
      // Don't forget to store the new refresh token as well!
      this.refreshToken = response["access_token"];
      console.log('RAccess Token from oauth: ',this.refreshToken)
      // Go to backend
    }).catch(reason => {
        console.error("Refreshing token failed", reason);
    });
  }
  userData:any=[]

  constructor(private loadingController:LoadingController,private http:HttpClient,private router:Router,
    private afauth:AngularFireAuth,private afs: AngularFirestore,private storage: AngularFireStorage,
    private toastController:ToastController) {
      this.userData.isAdmin=atob(window.location.href.split('/extraction/')[1].split('%3D')[0]).split('randomNameByMe')[0];
      this.userData.email=atob(window.location.href.split('/extraction/')[1].split('%3D')[0]).split('randomNameByMe')[1];
      this.userData.isAdmin2=atob(window.location.href.split('/extraction/')[1].split('%3D')[0]).split('randomNameByMe')[2];

      this.userData.password=atob(window.location.href.split('/extraction/')[1].split('%3D')[0]).split('randomNameByMe')[3];
      this.userData.name=atob(window.location.href.split('/extraction/')[1].split('%3D')[0]).split('randomNameByMe')[4];
  
      this.userData.userId=atob(window.location.href.split('/extraction/')[1].split('%3D')[0]).split('randomNameByMe')[5];
      if(this.userData.isAdmin != "true" || this.userData.isAdmin != "true"){
        this.router.navigateByUrl('/login');
      }
  
    }

  forms:any = [];
  
  getData(){

    this.presentLoading();


        





        let userDoc = this.afs.firestore.collection(`forms`);
    userDoc.get().then((querySnapshot) => { 
    
        
     
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
        

        if ((doc.data().Processed == false)){
          const data = JSON.stringify({
         
            "values": [
              [
                (doc.data()['Serial No'] || 'NA'),new Date().toString(),doc.data().Id,doc.data().Name, doc.data()['Aadhar Number'],doc.data()['Mobile Number'],doc.data()['District'],doc.data()['Taluka'],
                doc.data()['Village'],doc.data()['Crop Type'],doc.data()['Address'],doc.data()['Pin Code'],doc.data()['Image Url']
              ]
            ]
          });
          let headers = new Headers;
          headers.append('Content-Type','application/json');
          headers.append('Accept','application/json');
          headers.append('Authorization',`Bearer ${this.refreshToken}`);
          // headers.append('Content-Length',data.length)
          // const httpOptions = {headers:headers}
         
          // var jsonString = JSON.stringify(data);
            fetch(
              `https://sheets.googleapis.com/v4/spreadsheets/15PS5n71sE5KGsLwXoSa5FhcdsdQ2805PflgEyPt_a_M/values/A1%3AZ8:append?insertDataOption=INSERT_ROWS&responseDateTimeRenderOption=SERIAL_NUMBER&responseValueRenderOption=UNFORMATTED_VALUE&valueInputOption=USER_ENTERED&key=AIzaSyBr5V0A2QYDGK1LizVo-2sdfnoZEkM_W-U`,{
                "method":"POST",
                "body":data,
                "headers":headers
            }
            
            ).then((res)=>{
              console.log("post resp: ",res)
            })
            
          
        
          
         
          this.forms[this.forms.length] = {'Serial No': (doc.data()['Serial No'] ||'NA'),'Id':doc.data().Id,'Name':doc.data().Name,'Address':doc.data().Address,
          'Mobile Number':doc.data()['Mobile Number'],'Aadhar Number':doc.data()['Aadhar Number'],'Crop Type':doc.data()['Crop Type'],
          'District':doc.data()['District'],'Taluka':doc.data()['Taluka'],'Village':doc.data().Village,'Pin Code':doc.data()['Pin Code'],
          'Image Url':doc.data()['Image Url']};
          console.log(this.forms);
          this.afs.collection('forms').doc(doc.id).set({
            'Id':doc.data().Id,'Name':doc.data()['Name'],'Address':doc.data()['Address'],'Serial No': (doc.data()['Serial No'] || 'NA'),
            'Mobile Number':doc.data()['Mobile Number'],'Aadhar Number':doc.data()['Aadhar Number'],'Crop Type':doc.data()['Crop Type'],
            'District':doc.data()['District'],'Taluka':doc.data()['Taluka'],'Village':doc.data().Village,'Pin Code':doc.data()['Pin Code'],
            'Image Url':doc.data()['Image Url'],'Processed':true
          })
        }
})
    }).then(()=>{
      this.toast('Forms Updated in Google Sheet','success');
      this.loading.dismiss();
    })
  }
  async toast(val,color){
  
    const toast = await this.toastController.create({
      message: val,
      position:'middle',
      color:color,
      duration: 2000
    });
    toast.present();
  }
    
      
      
      }
  
        
    
    
  


     


   


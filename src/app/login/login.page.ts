import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController, MenuController, NavController, ToastController } from '@ionic/angular';
// import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
// import { AuthService } from '../services/auth.service';
// import { Uid } from '@ionic-native/uid/ngx';
// import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Plugins } from '@capacitor/core';
// import { GooglePlus } from '@ionic-native/google-plus/ngx';

const { Device } = Plugins;



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password:string;
  menuCtrl: any;
  deviceId:any;
  
  constructor(
    private router: Router,
    // private googlePlus: GooglePlus,
    // private uid: Uid, private androidPermissions: AndroidPermissions,
    // private uniqueDeviceID: UniqueDeviceID,
    // private auth: AuthService,
    private afs: AngularFirestore,
    private afauth:AngularFireAuth,

    private toastr: ToastController,
    private loadingCtrl: LoadingController,
    private navCrtl: NavController, private menu: MenuController

  ) {
    // the left menu should be disabled on the login page
   
  }
  // async getImei() {
  //   const { hasPermission } = await this.androidPermissions.checkPermission(
  //     this.androidPermissions.PERMISSION.READ_PHONE_STATE
  //   );
   
  //   if (!hasPermission) {
  //     const result = await this.androidPermissions.requestPermission(
  //       this.androidPermissions.PERMISSION.READ_PHONE_STATE
  //     );
   
  //     if (!result.hasPermission) {
  //       throw new Error('Permissions required');
  //     }
   
  //     // ok, a user gave us permission, we can get him identifiers after restart app
  //     return;
  //   }
   
  //    alert(this.uid.IMEI);
  //    return this.uid.IMEI;
  //  }
  logout(){
    this.afauth.signOut().then(()=>{
      this.router.navigate(['/login']);
    })
  }

  

  ngOnInit() {
    // this.autoLogin();
    }
  userinfo;
  store;
  register(){
    this.router.navigate(['/register']);
  }//end of register
  forgot(){
    this.router.navigate(['/forgot']);
  }//end of forgot
 

  async login(){
    if(this.email && this.password){
      const loading = await this.loadingCtrl.create({
        message:'Logging in...',
        spinner:'crescent',
        showBackdrop:true
      });
      loading.present();
      this.afauth.signInWithEmailAndPassword(this.email,this.password).then(async (data)=>{
        if(!data.user.emailVerified)
        {
          (await this.afauth.currentUser).sendEmailVerification()
          loading.dismiss();
          this.toast('Please verify your email address. A verification mail is sent to your email address!','danger');
          this.logout();
          this.afauth.signOut().then(()=>{
            this.router.navigate(['/login']);
          })   }
          else{    
           let userDoc = this.afs.firestore.collection(`users`);
    userDoc.get().then((querySnapshot) => { 
      this.userinfo=[];
      this.store=[];
      
        
     
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
        if ((doc.data().email == this.email)){
          const store = doc.data();
          this.userinfo = store.isAdmin+'randomNameByMe'+store.email+'randomNameByMe'+store.isAdmin + 'randomNameByMe' + this.password+'randomNameByMe'+store.name;
          console.log(this.userinfo);
          console.log('just before routing from login: ',btoa(this.userinfo))
          this.userinfo = store.isAdmin+'randomNameByMe'+store.email+'randomNameByMe'+store.password+'randomNameByMe'+store.name+'randomNameByMe'+store.userId;
          console.log(this.userinfo);
          console.log('just before routing from login: ',btoa(this.userinfo))
            this.router.navigate([`/extraction/${btoa(this.userinfo)}`]);
            this.isRegistered=true;
         

          loading.dismiss();

          
          
          

          

        }
        
       
      
      })
        

       

      })}


      
        // the left menu should be disabled on the login page

      
    }).catch((error)=>{
      loading.dismiss();
      this.toast(error.message,'danger');
      this.router.navigate(['/login']);
    });
    }
    else{
      this.toast('Please enter your email and password correctly!','danger');
    }
  }//end of login
  async toast(message,status){
    const toast = await this.toastr.create({
      message:message,
      position:'top',
      color:status,
      duration:2000
    });
    toast.present()
  }//end of toast

  // getUniqueDeviceId(){
  //   this.uniqueDeviceID.get()
  // .then((uuid: any) => {
  // this.deviceId=uuid;
  
  // alert(uuid)
  // })
  // .catch((error: any) => console.log(error));
  // }
  // login2(){
  //   this.googlePlus.login({})
  // .then(res => alert(res))
  // .catch(err => console.error(err));
  // }
  isRegistered=false;
// autoLogin(){
//   // this.deviceId=this.getDeviceInfo();
//   let userDoc = this.afs.firestore.collection(`users`);
//   userDoc.get().then((querySnapshot) => { 
//     this.userinfo=[];
//     this.store=[];
    
      
   
//     querySnapshot.forEach((doc) => {
//       console.log(doc.id, "=>", doc.data());
//       if ((doc.data().deviceId == this.deviceId )){
//         const store = doc.data();
//         this.userinfo = store.isAdmin+'randomNameByMe'+store.email+'randomNameByMe'+this.password+'randomNameByMe'+store.name;
//         console.log(this.userinfo);
//         console.log('just before routing from login: ',btoa(this.userinfo))
//         this.router.navigate([`/home/${this.userinfo}`]);
//         this.isRegistered=true;
      
      
//       }})}
//       )

    
//     }





}

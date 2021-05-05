import { HttpClient, HttpHeaders,  } from '@angular/common/http';
import { Component } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Plugins, CameraResultType } from '@capacitor/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
 
const { Camera } = Plugins;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  form:any = [];
  crop:any = [];
  crops:any = [];
  districts:any = [];districts2:any = [];
  district:any = [];
  talukas:any=[];talukas2:any = [];
  taluka:any=[];
  villages:any=[];villages2:any=[];
  village:any=[];
  constructor(private http:HttpClient,private loadingController:LoadingController,
    private afauth:AngularFireAuth,private afs: AngularFirestore,private storage: AngularFireStorage,
    private toastController:ToastController) {
    
    this.crops = [
      {'id':1,'val':'कपास'},
      {'id':2,'val':'केला'},
      {'id':3,'val':'गन्ना'},
      {'id':4,'val':'पपया'},
      {'id':5,'val':'सोयबीन'},
      {'id':6,'val':'अंगुर'},
      {'id':7,'val':'अनार'},
      {'id':8,'val':'गेहूँ'},
      {'id':9,'val':'मक्का'},
      {'id':10,'val':'आलू'},
      {'id':11,'val':'प्याज'},
      {'id':12,'val':'मिर्च'},
      {'id':13,'val':'लहसून'},
      {'id':14,'val':'धान'},
      {'id':15,'val':'हलदी'},
      {'id':16,'val':'अद्रक'},
      {'id':17,'val':'सभी सब्जियाँ'},
      {'id':18,'val':'दाल वर्गीय फसले'},
     
    ];
    
    
  }
  loading:any
  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'कृपया धैर्य रखें...',
      
    });
    await this.loading.present();
  }
  pin_correct = false;
  async getLocation(){
    


    this.talukas = [];
    this.districts = [];
    this.villages = [];
    this.taluka = [];
    this.district = [];
    this.village = [];
    this.talukas2 = [];
    this.districts2 = [];
    this.villages2 = [];
    await this.http.get(
      `https://api.postalpincode.in/pincode/${this.form.pin}`
    ).subscribe((response)=>{
      if(response[0]['PostOffice']){
        this.pin_correct=true
      this.presentLoading();
      console.log('Location from Pin: ',response)
      let i =1;
      for(let j=0;j<response[0]['PostOffice'].length;j++){
        let flagj=0;
        if(j>0){
          for(let m=0;m<j;m++){
            if(response[0]['PostOffice'][j]['Block'] == this.talukas[m]['val']){
              flagj=1;
              break;
            }
           
          }
          if(flagj == 1){
            continue;
          }
          else {
            this.talukas[j]= {'id':i,'val':response[0]['PostOffice'][j]['Block']}
            i = i+1;
          }

        }
        
        else if(j==0) {
          this.talukas[j]= {'id':i,'val':response[0]['PostOffice'][j]['Block']};
          i = i+1;
        }

        
         
      }
      
      // if(this.talukas.length == 1){
      //   this.taluka = this.talukas[0];
      //   this.taluka.val = this.taluka.val
      // }
      let k = 1;
      for(let j=0;j<response[0]['PostOffice'].length;j++){
        let flagj=0;
        if(j>0){
          for(let m=0;m<j;m++){
            if(response[0]['PostOffice'][j]['District'] == this.districts[m]['val']){
              flagj=1;
              break;
            }
           
          }
          if(flagj == 1){
            continue;
          }
          else {
            this.districts[j]= {'id':k,'val':response[0]['PostOffice'][j]['District']}
            k = k+1;
          }

        }
        
        else if(j==0) {
          this.districts[j]= {'id':k,'val':response[0]['PostOffice'][j]['District']};
          k = k+1;
        }

        
         
      }
      
      
      // if(this.districts.length == 1){
      //   this.district = this.districts[0];
      // }
     
      let m = 1;
      for(let j=0;j<response[0]['PostOffice'].length;j++){
        let flagj=0;
        if(j>0){
          for(let m=0;m<j;m++){
            if(response[0]['PostOffice'][j]['Name'] == this.villages[m]['val']){
              flagj=1;
              break;
            }
           
          }
          if(flagj == 1){
            continue;
          }
          else {
            this.villages[j]= {'id':m,'val':response[0]['PostOffice'][j]['Name']}
            m = m+1;
          }

        }
        
        else if(j==0) {
          this.villages[j]= {'id':m,'val':response[0]['PostOffice'][j]['Name']};
          m = m+1;
        }
      

        
         
      }
    this.translate2Hindi1();
    // this.translate2Hindi2();
    // this.translate2Hindi3();
    
     
  }
  else{
    this.toast('कृपया सही पिन कोड दर्ज करें!','danger')
  }
    }),
      
    
    console.log('Districts: ',this.districts, 'Talukas: ',this.talukas,'Villages: ',this.villages);
    
    
    

   
   


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

text='hello';

translate2Hindi1(){
 
let res2 = []


this.http.get(`https://google-translate20.p.rapidapi.com/translate?text=${this.districts[0].val}&tl=hi&sl=en`, 
	
	{headers:new HttpHeaders( {
		"x-rapidapi-key": "0e07427772msh34fa8509f0ebf74p1d33f0jsn9f6414191477",
		"x-rapidapi-host": "google-translate20.p.rapidapi.com"
	})},
	)
.subscribe((response) => {
	res2 = response['data'].translation.split('नमस्ते');
  console.log('Trans 1: ',res2)
  this.districts2[0] = {'id':1,'val':res2}
  this.translate2Hindi2();
  
  
  
}
)


}
translate2Hindi2(){
 
  let result = '';
  for(let i = 0;i<this.talukas.length;i++){
    result += this.talukas[i].val +' namaste ';
  }
  console.log('Result 2: ',result)
  this.http.get(`https://google-translate20.p.rapidapi.com/translate?text=${result}&tl=hi&sl=en`, 
    
    {headers:new HttpHeaders( {
      "x-rapidapi-key": "0e07427772msh34fa8509f0ebf74p1d33f0jsn9f6414191477",
      "x-rapidapi-host": "google-translate20.p.rapidapi.com"
    })},
    )
  .subscribe(async response => {
    let res = []
    res = response['data'].translation.split('नमस्ते')
      for(let i=0;i<res.length-1;i++){
        this.talukas2[i] = {'id':i+1,'val':res[i]}
  
      }
    this.translate2Hindi3();
      
  })
  
  
  }
  translate2Hindi3(){
 
    let result = '';
    for(let i = 0;i<this.villages.length;i++){
      result += this.villages[i].val + ' namaste ';
    }
    console.log('Result 3: ',result)

    this.http.get(`https://google-translate20.p.rapidapi.com/translate?text=${result}&tl=hi&sl=en`, 
      
      {headers:new HttpHeaders( {
        "x-rapidapi-key": "0e07427772msh34fa8509f0ebf74p1d33f0jsn9f6414191477",
        "x-rapidapi-host": "google-translate20.p.rapidapi.com"
      })},
      )
    .subscribe(response => {
      let res = []
      res = response['data'].translation.split('नमस्ते');
      console.log('Res: ',res)
      for(let i=0;i<res.length-1;i++){
        
        this.villages2[i] = {'id':i+1,'val':res[i]}

      }
      this.loading.dismiss();
    })
    
    
    }
    uploadProgress =0;uploadedImages :any= []

    
    imageElement:any
    convertBase64ToBlob(base64Image: string) {
      // Split into two parts
      const parts = base64Image.split(';base64,');
    
      // Hold the content type
      const imageType = parts[0].split(':')[1];
    
      // Decode Base64 string
      const decodedData = window.atob(parts[1]);
    
      // Create UNIT8ARRAY of size same as row data length
      const uInt8Array = new Uint8Array(decodedData.length);
    
      // Insert all character code into uInt8Array
      for (let i = 0; i < decodedData.length; ++i) {
        uInt8Array[i] = decodedData.charCodeAt(i);
      }
    
      // Return BLOB image after conversion
      return new Blob([uInt8Array], { type: imageType });
    }
    async takePicture() {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64
      });
      // image.webPath will contain a path that can be set as an image src.
      // You can access the original file using image.path, which can be
      // passed to the Filesystem API to read the raw data of the image,
      // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
      
      // Can be set to the src of an image now
      let blob: Blob = this.convertBase64ToBlob('data:image/jpeg;base64,' + image.base64String)
      // create blobURL, such that we could use it in an image element:
      
      // const randomId = Math.random()
      // .toString(36)
      // .substring(2, 8);
      let date = new Date().getTime()
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'कृपया धैर्य रखें...',
        spinner:'circles',
      });
      await loading.present();
  
    const uploadTask = this.storage.upload(
      `files/${date}_image`,
      blob
    );
  
    
  
    uploadTask.percentageChanges().subscribe(async change => {
      this.uploadProgress = change;
      
      
    });
  
  // https://firebasestorage.googleapis.com/v0/b/expenses-aarc.appspot.com/o/files%2F1_image_1?alt=media&token=13a3a975-c542-47bd-91c3-18b8d7eb539b
    uploadTask.then(async res => {
      loading.dismiss();
      this.uploadedImages=true;
  
      this.form.image=`https://firebasestorage.googleapis.com/v0/b/meri-samruddhi.appspot.com/o/files%2F${date}_image?alt=media&token=6bf11827-d096-4fea-90db-bacd977959df`
      this.toast('छवि अपलोड हो गई!',"success")
    });
  
    }
  
  
      // get the blob of the image:
      
   
      
    

    submit(){
      console.log(this.form);
      let form_id = this.form.name+'_'+new Date().getTime().toString();
      if(form_id){
        // console.log('Article Details: ',this.article);
        this.afs.collection('forms').doc(form_id).set({
          'Name':this.form.name,
          'Address':this.form.address,
          'Mobile Number':this.form.mobile,
          'Aadhar Number':this.form.aadhar,
          'Crop Type':this.crop.val,
          'District':this.district.val,
          'Taluka':this.taluka.val,
          'Village':this.village.val,
          'Id': form_id,
          'Processed':false,
          'Image Url':this.form.image,
          
      }).then(()=>{
        this.toast('फार्म जमा किया गया!','success')
  
        this.clear();
      })
    } 
      else{
        this.toast('कृपया फ़ॉर्म को पूरा करें!','danger');
      }
  
      
    }
    clear(){
      this.form = [];
      this.crop = [];
      this.pin_correct=false;
  this.districts = [];this.districts2 = [];
  this.district = [];
  this.talukas=[];this.talukas2= [];
  this.taluka=[];
  this.villages=[];this.villages2=[];
  this.village=[];
    }
}

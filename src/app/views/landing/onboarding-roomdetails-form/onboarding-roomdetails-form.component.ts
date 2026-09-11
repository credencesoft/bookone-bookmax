import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { json } from 'express';
import { BusinessLineDTO } from 'src/model/businessLeadsDto';
import { RoomDetails } from 'src/model/roomdetails';
import { ListingService } from 'src/services/listing.service';
import { TokenStorage } from 'src/token.storage';
// import { BusinessLineDTO } from 'src/app/model/businessLeadsDto';
// import { RoomDetails } from 'src/app/model/roomdetails';
// import { ListingService } from 'src/app/services/listing.service';
// import { RoomDetails } from 'src/app/model/roomdetails';
// import { RoomInfo } from 'src/app/model/roominfo';
// import { TokenStorage } from 'src/app/token.storage';
// import { UploadImageFile } from '../uploadImageFile';
// import { FileService } from 'src/app/services/file-service.service';
// import { Logger } from 'src/app/services/logger.service';
// import { Ng2ImgMaxService } from 'ng2-img-max';
// import pica from 'pica';



export class EnquiryForm {
  isCardClicked10a: string;
  isCardClicked11: string;
  isCardClicked22 : string;
  isCardClicked33 : string;
  isCardClicked44 : string;
  isCardClicked55 : string;
  isCardClicked66 : string;
  isCardClicked77 : string;
  isCardClicked88 : string;
  isCardClicked99 : string;
  isCardClicked100 : string;
  isCardClicked111 : string;


}

@Component({
  selector: 'app-onboarding-roomdetails-form',
  templateUrl: './onboarding-roomdetails-form.component.html',
  styleUrls: ['./onboarding-roomdetails-form.component.scss']
})

export class OnboardingRoomdetailsFormComponent {
  productLine : any;
  backgroundColor = 'landing-gradient-purple-indigo';
  amenities = false;
  isCardClicked = false;
  isCardClicked1 = false;
  isCardClicked2 = false;
  isCardClicked3 = false;
  isCardClicked4 = false;
  isCardClicked5 = false;
  isCardClicked6 = false;
  isCardClicked7 = false;
  isCardClicked8 = false;
  isCardClicked9 = false;
  isCardClicked10 = false;
  isCardClicked11 = false;
  @Input() progress: number = 0;

  isupload= true;
  uploadarray = [""];
  roomarray = [""];
  businessLogo: string;


  isImageUploaded: boolean = false;
  uploadedImage: any;
  LogoURL: string;
  // uploadImageFile: UploadImageFile;
  formData: FormData;
  del = delIndex => this.uploadarray.splice(delIndex, 1);
  add = () => this.uploadarray.push("");
  // add1 = () => this.roomarray.push("");
  del1 = delIndex => this.roomdetailsarray.splice(delIndex, 1);

  roomnum: number;
  businessleadDto:BusinessLineDTO;
  roomdetails:RoomDetails
  roomNocontrol: FormControl = new FormControl([Validators.required]);
  roomTypecontrol: FormControl = new FormControl([Validators.required]);
  roomCountcontrol: FormControl = new FormControl([Validators.required]);
roomdetailsarray =[]
roomType:string;
roomCount:number;
enquiryForm : EnquiryForm;

  buesinessLeadsDto: UntypedFormGroup = new UntypedFormGroup({
    roomNocontrol:this.roomNocontrol,
    roomCountcontrol:this.roomCountcontrol,
    roomTypecontrol:this.roomTypecontrol
  });
  businessLead: BusinessLineDTO;
  loader: boolean;
  businessLeadId: string;
  businessLeadData: BusinessLineDTO[];

  constructor(private token:TokenStorage,
   private listingService:ListingService,
  //  private ng2ImgMax: Ng2ImgMaxService,
    private changeDetectorRefs: ChangeDetectorRef,

   ) {
 this.businessleadDto = this.token.getLeads();
 this.enquiryForm = new EnquiryForm();
 this.productLine = [];
 this.businessLeadId = this.token.getBusinessLeadId()
 this.getBusinessLeadById();
  }


  ngOnInit(): void {
  }
getBusinessLeadById(){
  this.listingService.getBusinessLeadByBusinessLeadId(this.businessLeadId).subscribe(data => {
    this.businessLead = data.body;
    // console.log(JSON.stringify(this.businessLeadData))
    })
}
updateToken(){
  this.token.saveLeads(this.businessleadDto)
}
  toggleamenities() {
    if (this.amenities === false) {
      this.amenities = true;
    } else if (this.amenities === true) {
      this.amenities = false;
    }
  }

  toggleCardState() {
    this.isCardClicked = !this.isCardClicked;
    // console.log('Card a clicked');
    this.enquiryForm.isCardClicked10a = "website"
    this.productLine.push("PMS");
    // console.log ('' + JSON.stringify(this.productLine))

  }
  onClickCard1() {

    // console.log('Card 1 clicked');

    this.isCardClicked1 = !this.isCardClicked1;
    this.productLine.push("CM");
    // console.log ('' + JSON.stringify(this.productLine))
  }

  onClickCard2() {

    // console.log('Card 2 clicked');

    this.isCardClicked2 = !this.isCardClicked2;
    this.productLine.push("Google Hotels");
    // console.log ('' + JSON.stringify(this.productLine))

  }
  onClickCard3() {

    // console.log('Card 3 clicked');

    this.isCardClicked3 = !this.isCardClicked3;
    this.productLine.push("POS");
    // console.log ('' + JSON.stringify(this.productLine))

  }
  onClickCard4() {

    // console.log('Card 4 clicked');

    this.isCardClicked4 = !this.isCardClicked4;
    this.productLine.push("SMO");
    // console.log ('' + JSON.stringify(this.productLine))

  }
  onClickCard5() {

    // console.log('Card 5 clicked');

    this.isCardClicked5 = !this.isCardClicked5;
    this.productLine.push("OTASetup");
    // console.log ('' + JSON.stringify(this.productLine))

  }
  onClickCard6() {

    // console.log('Card 6 clicked');

    this.isCardClicked6 = !this.isCardClicked6;
    this.productLine.push("website");
    // console.log ('' + JSON.stringify(this.productLine))

  }
  onClickCard7() {

    // console.log('Card 7 clicked');

    this.isCardClicked7 = !this.isCardClicked7;
    this.productLine.push("Booking Engine");
    // console.log ('' + JSON.stringify(this.productLine))

  }
  runCampaign() {
      this.listingService.runCampaign(46,this.businessLeadId).subscribe((response) => {
        if (response.body.status === "Success") {
          // this.dialogRef.close();
          //  this.("Email sent successfully!!");
           } else {
             }});
             this.changeDetectorRefs.detectChanges();
}
  onClickCard8() {

    // console.log('Card 8 clicked');

    this.isCardClicked8 = !this.isCardClicked8;
    this.productLine.push("Email / GSuite");
    // console.log ('' + JSON.stringify(this.productLine))

  }
  onClickCard9() {

    // console.log('Card 9 clicked');

    this.isCardClicked9 = !this.isCardClicked9;
    this.productLine.push("DigitalMarketing");
    // console.log ('' + JSON.stringify(this.productLine))

  }
  onClickCard10() {

    // console.log('Card 10 clicked');

    this.isCardClicked10 = !this.isCardClicked10;
    this.productLine.push("Qracle");
    // console.log ('' + JSON.stringify(this.productLine))

  }
  onClickCard11() {

    // console.log('Card 11 clicked');

    this.isCardClicked11 = !this.isCardClicked11;
    this.productLine.push("HotelMate");
    // console.log ('' + JSON.stringify(this.productLine))

  }

  // add1(){
  //   this.roomarray.push("");


  // }
  addmore(){
    this.roomdetails = new RoomDetails();
    this.roomdetails.roomType = this.roomType;
    this.roomdetails.roomCount = this.roomCount;
    this.roomdetailsarray.push(this.roomdetails)
    this.buesinessLeadsDto.reset();
    // console.log(JSON.stringify(this.roomdetailsarray))
    this.businessleadDto.roomInfoList =this.roomdetailsarray;
    this.token.saveLeads(this.businessleadDto)
  }
next(){
  this.businessleadDto.productLines = this.productLine;

  this.businessleadDto.id = this.businessLead.id;
  this.businessleadDto.managerEmailAddress ="hello@bookonepms.com"
  this.token.saveLeads(this.businessleadDto);
  this.listingService.saveBusinessLeads(this.businessleadDto).subscribe(data => {
  this.businessLead = data.body;
  // this.token.saveBusinessLeadId(this.businessLead.id.toString());
  // console.log(JSON.stringify(this.businessLead))
  })
  this.runCampaign();

}
onFileSelected(event: Event): void {
  const inputElement = event.target as HTMLInputElement;
  if (inputElement.files && inputElement.files[0]) {
    this.uploadedImage = inputElement.files[0];
    // console.log('Event:', event);
    // console.log('Selected File:', this.uploadedImage);
  }
}





}

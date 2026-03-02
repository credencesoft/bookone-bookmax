import { DatePipe } from '@angular/common';
import { Component, Input, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, UntypedFormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessLineDTO } from 'src/model/businessLeadsDto';
import { ListingService } from 'src/services/listing.service';
import { TokenStorage } from 'src/token.storage';
// import { BusinessLineDTO } from 'src/app/model/businessLeadsDto';
// import { ListingService } from 'src/app/services/listing.service';
// import { TokenStorage } from 'src/app/token.storage';

@Component({
  selector: 'app-onboarding-couponcode-form',
  templateUrl: './onboarding-couponcode-form.component.html',
  styleUrls: ['./onboarding-couponcode-form.component.scss']
})
export class OnboardingCouponcodeFormComponent {
  isPopupVisible: boolean = false;
  hidediv : boolean = true;
  dropdownOptions: string[] = ['Facebook', 'Instagram', 'WhatsApp', 'Website', 'Others'];
  pagename = 'Onboarding-couponcode-form';

  backgroundColor = 'landing-gradient-purple-indigo';
  showCustomizer = false;

  // selectedOption: string = '';
  isDropdownOpen: boolean = false;
  nameControl: FormControl = new FormControl([Validators.required]);
  hearAboutUsControl: FormControl = new FormControl([Validators.required]);
  hotelnameControl: FormControl = new FormControl([Validators.required]);
  selectedOptionControl: FormControl = new FormControl([Validators.required])
  selectedOptionothersControl: FormControl = new FormControl([Validators.required])
  phoneControl: FormControl = new FormControl([
    Validators.required,
    Validators.pattern["(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,10}$"]
  ]);
  fromEmailControl: FormControl = new FormControl([
    Validators.required,
    Validators.pattern[
      "/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/"
    ],
  ]);
  businessLineDTO: BusinessLineDTO;
  buesinessLeads: UntypedFormGroup = new UntypedFormGroup({
    nameControl:this.nameControl,
    hotelnameControl:this.hotelnameControl,
    phoneControl:this.phoneControl,
    fromEmailControl:this.fromEmailControl,
    hearAboutUsControl:this.hearAboutUsControl
  });
  name: string;
  hotelname: string;
  phone: string;
  fromEmail: string;
  foundustext: string;
  businessLead: BusinessLineDTO;
  campainId: any;
  coupon: any;
  constructor(private token: TokenStorage,
    // private  route: Router,
    private listingService:ListingService,
    private titleService:Title,
    private metaService:Meta,
    private router: Router,
    private routerone: ActivatedRoute,
    public datepipe: DatePipe,
    private route: ActivatedRoute
    ) {
      this.updateTag();
    this.businessLineDTO = new BusinessLineDTO();
    if (this.token.getLeads() != null && this.token.getLeads() != undefined) {
      this.businessLineDTO = this.token.getLeads();
    }
    this.routerone.queryParams.subscribe((params) => {
      // debugger
      if (params['campainId'] !== undefined) {
        this.campainId = params['campainId'];
      }

      if (params['coupon'] !== undefined) {
        this.coupon = params['coupon'];
      }
    })
    if(this.campainId != null && this.campainId != undefined){
      this.getBusinessLeadById();
    }
if (this.campainId == null ||this.campainId == '' || this.campainId == undefined || this.coupon == undefined || this.coupon == '' || this.coupon == null) {

  this.hidediv = true;
} else {
  this.hidediv = false;
}
  }



  ngOnInit(): void {
    let businessSlug = this.routerone.snapshot.params['onboardingCouponcode-form'];
    // console.log("dfghjk"+this.campainId)
    // console.log("dfghjk"+this.coupon)


  }

  changeBg(colorName) {
    this.backgroundColor = 'landing-' + colorName;
  }
  toggleCustomizer() {
    this.showCustomizer = !this.showCustomizer;

  }


getBusinessLeadById(){
  this.listingService.getBusinessLeadByBusinessLeadId(this.campainId).subscribe(data => {
    this.businessLineDTO = data.body;
    // console.log(JSON.stringify(this.businessLeadData))
    })
}
  ngAfterViewInit() {}
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
  updateTag() {

    const description =
    'One stop solution';
    const title = 'Maximize your property bookings through the Bookone PMS  | Bookone PMS';
    const keywords =
    'One stop solution';
    const ogTitle = 'Maximize your property bookings through the Bookone PMS | Bookone PMS';
    const ogDescription =
    'One stop solution';
    const ogImage = 'https://bookonepms.com/assets/images/formimg.png';
    const ogSiteName = 'Maximize your property bookings through the Bookone PMS | Bookone PMS';
    const ogUrl = 'https://bookonepms.com/onboardingCouponcode-form';
  // const ogSiteName = '';
  this.setTitle(title);
  this.metaService.updateTag({ name: "title", content: title });
  this.metaService.updateTag({ name: "keywords", content: keywords });
  this.metaService.updateTag({ name: "description", content: description });
  this.metaService.updateTag({ name: "robots", content: "index,follow" });
  // fb

  this.metaService.updateTag({ property: 'og:title', content: ogTitle });
  this.metaService.updateTag({
    property: 'og:description',
    content: ogDescription,
  });
  this.metaService.updateTag({ property: 'og:image', content: ogImage });
  this.metaService.updateTag({ property: 'og:url', content: ogUrl });
  this.metaService.updateTag({
    property: 'og:site_name',
    content: ogSiteName,
  });
  this.metaService.updateTag({ property: 'og:image', content: ogImage });
  // twitter
  this.metaService.updateTag({ property: 'twitter:title', content: ogTitle });
  this.metaService.updateTag({
    property: 'twitter:description',
    content: ogDescription,
  });
  this.metaService.updateTag({ property: 'twitter:image', content: ogImage });
  this.metaService.updateTag({
    property: 'twitter:image:alt',
    content: ogDescription,
  });
  }



  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: string) {
    this.businessLineDTO.howDidYouHearAboutUs = option;
    this.isDropdownOpen = false;
  }

  amenities = false;
  @Input() progress: number = 0;

  toggleamenities() {
    if (this.amenities === false) {
      this.amenities = true;
    } else if (this.amenities === true) {
      this.amenities = false;
    }
  }


  next(){
    // debugger
// console.log( JSON.stringify(this.businessLineDTO));
this.businessLineDTO.businessType ="Accommodation",
this.businessLineDTO.organisationId = 1,
// this.businessLineDTO.propertyId = 443
this.businessLineDTO.propertyId = 107
if(this.campainId != null && this.campainId != undefined){
this.businessLineDTO.id =this.campainId;

}
if(this.coupon != null && this.coupon != undefined){
  this.businessLineDTO.coupon =this.coupon;

  }

// let x= new Date();
this.businessLineDTO.dateCollected  = this.datepipe.transform(new Date(), "yyyy-MM-dd");
this.token.saveLeads(this.businessLineDTO);
if(this.campainId != null && this.campainId != undefined){
  this.token.saveBusinessLeadId(this.campainId.toString());
}
this.listingService.saveBusinessLeads(this.businessLineDTO).subscribe(data => {
  this.businessLead = data.body;
  this.token.saveBusinessLeadId(this.businessLead.id.toString());
  // console.log(JSON.stringify(this.businessLead))
  if (this.campainId  != null && this.campainId != undefined ) {
    // Assuming you have a dynamic campaignId value
  const dynamicCampaignId = this.campainId;

  this.router.navigate(['/onboardingThankyou-form'], {
    queryParams: { campaignId: dynamicCampaignId },
    skipLocationChange: true
  });
  // this.router.navigate([url]);
      // this.router.navigate(decodeURIComponent["/onboardingThankyou-form?campainId="+this.campainId]);
    } else {
      this.router.navigate(['/onboardingThankyou-form']);
    }
  })

  }

  openPopup(): void {
    this.isPopupVisible = true;
  }

  closePopup(): void {
    this.isPopupVisible = false;
    this.hidediv=true;
  }
}

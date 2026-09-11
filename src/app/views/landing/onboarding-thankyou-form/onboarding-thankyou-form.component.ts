// import { number } from 'echarts';
import { ChangeDetectorRef, Component, ElementRef, Input } from '@angular/core';
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { json } from 'express';
// import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { debounceTime } from 'rxjs';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { City } from 'src/model/address-setup/city';
import { State } from 'src/model/address-setup/state';
import { Suburb } from 'src/model/address-setup/suburbDto';
import { BusinessLineDTO } from 'src/model/businessLeadsDto';
// import { City } from 'src/model/city';
import { PropertyAddress } from 'src/model/propertyAddress';
import { ListingService } from 'src/services/listing.service';
import { TokenStorage } from 'src/token.storage';
// import { Address } from 'src/app/model/address';
// import { City } from 'src/app/model/address-setup/city';
// import { Country } from 'src/app/model/address-setup/country';
// import { State } from 'src/app/model/address-setup/state';
// import { Street } from 'src/app/model/address-setup/street';
// import { Suburb } from 'src/app/model/address-setup/suburbDto';
// import { Address } from 'ngx-google-places-autocomplete/objects/address';
// import { Booking } from 'src/app/model/booking';
// import { BusinessLineDTO } from 'src/app/model/businessLeadsDto';
// import { PropertyAddress } from 'src/app/model/propertyAddress';
// import { BusinessUser } from 'src/app/model/user';
// import { AddressService } from 'src/app/services/address-service.service';
// import { BusinessService } from 'src/app/services/business.service';
// import { ListingService } from 'src/app/services/listing.service';
// import { Logger } from 'src/app/services/logger.service';
// import { TokenStorage } from 'src/app/token.storage';

@Component({
  selector: 'app-onboarding-thankyou-form',
  templateUrl: './onboarding-thankyou-form.component.html',
  styleUrls: ['./onboarding-thankyou-form.component.scss']
})
export class OnboardingThankyouFormComponent {
  options: any = {
    componentRestrictions: { country: 'IN' }
  }

  backgroundColor = 'landing-gradient-purple-indigo';
  bookingCity: string;
  // businessUser: BusinessUser;
  subType = "All";
  address: PropertyAddress;
  // streets: Street[];
  // streetsFilter: Street[];
  citiesFilter: City[];
  // street: Street;
  activetabContent: string;
  searchString: string;
  cities: any[];
  city: City;
  // countries: Country[];
  suburb: Suburb;
  suburbs: Suburb[];
  states: State[];
  suburbsLists: Suburb[];

  searchFilteredCities: any[];
  searchResultCity: string;
  isAddressFound = true;
  isAddressSearch = false;
  isLoginFrom = false;
  isStreetSelect = false;
  isSearchItem = false;

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  roomsAndOccupancy = false;
  todayDate: NgbDate | null;
  adults = 1;
  children = 0;
  rooms = 1;
  // booking: Booking;
  businessLineDTO:BusinessLineDTO
  country: string;

  amenities = false;

  cityControl: FormControl = new FormControl([Validators.required]);
  stateControl: FormControl = new FormControl([Validators.required]);
  countryControl: FormControl = new FormControl([Validators.required]);
  streetnameControl: FormControl = new FormControl([Validators.required]);
  @Input() progress: number = 0;
  suburbsList: any[];
  isShowSubUrb: boolean =false;
  searchResultSuburb: any;
  citycontrol: FormControl = new FormControl([Validators.required]);
  streetNamecontrol: FormControl = new FormControl([Validators.required]);
  streetNumbercontrol: FormControl = new FormControl([Validators.required]);
  localitycontrol: FormControl = new FormControl([Validators.required]);
  subUrbcontrol: FormControl = new FormControl([Validators.required]);
  countrycontrol: FormControl = new FormControl([Validators.required]);
statecontrol: FormControl = new FormControl([Validators.required]);
postcodecontrol: FormControl = new FormControl([Validators.required]);






  buesinessLeadsDto: UntypedFormGroup = new UntypedFormGroup({
    citycontrol:this.citycontrol,
    statecontrol:this.statecontrol,
    subUrbcontrol:this.subUrbcontrol,
    localitycontrol:this.localitycontrol,
    streetNumbercontrol:this.streetNumbercontrol,
    streetNamecontrol:this.streetNamecontrol,
    countrycontrol:this.countrycontrol,
    postcodecontrol:this.postcodecontrol
  });
  businessLead: BusinessLineDTO;
  businessLeadId: string;
  campainId: any;
  coupon: any;

  toggleamenities() {
    if (this.amenities === false) {
      this.amenities = true;
    } else if (this.amenities === true) {
      this.amenities = false;
    }
  }

  constructor(

    private changeDetectorRefs: ChangeDetectorRef,
    private modalService: NgbModal,
    private router: Router,
    private listingService:ListingService,
    private acRoute: ActivatedRoute,
    private calendar: NgbCalendar,
    private token: TokenStorage,
    private routerone: ActivatedRoute,
    private _eref: ElementRef,
    public formatter: NgbDateParserFormatter) {
      this.getAllCities();
this.businessLeadId = this.token.getBusinessLeadId();
this.routerone.queryParams.subscribe((params) => {
  // debugger
  if (params['campainId'] !== undefined) {
    this.campainId = params['campainId'];
  }

  if (params['coupon'] !== undefined) {
    this.coupon = params['coupon'];
  }

})

      // this.businessLineDTO = this.token.getLeads();
      if (this.token.getLeads() != null && this.token.getLeads() != undefined) {
        this.businessLineDTO = this.token.getLeads();
        this.address = this.businessLineDTO.address;
        this.address= new PropertyAddress();
      } else {
        this.address= new PropertyAddress();
      }
      // this.businessLeadId = this.token.getBusinessLeadId();
      this.getBusinessLeadById();
     }

  ngOnInit(): void {

  }
  getBusinessLeadById(){
    this.listingService.getBusinessLeadByBusinessLeadId(this.businessLeadId).subscribe(data => {
      this.businessLead = data.body;
if (this.businessLead.address != null && this.businessLead.address != undefined) {
  this.address = this.businessLead.address ;
}
      // console.log(JSON.stringify(this.address))
      })

  }
  handleAddressChange(address: Address) {
    const formattedAddress = address.formatted_address;
    const components = address.address_components;
    const suburb = this.extractComponent(components, 'sublocality'); // Extract suburb
    const locality = this.extractComponent(components, 'locality'); // Extract locality
    const city = this.extractComponent(components, 'locality'); // Extract city
    const state = this.extractComponent(components, 'administrative_area_level_1'); // Extract state
    const country = this.extractComponent(components, 'country'); // Extract country
    const pincode = this.extractComponent(components, 'postal_code'); // Extract postal code
    const streetName = this.extractComponent(components, 'route');
    const streetNumber = this.extractComponent(components, 'street_number'); // Extract street number
    this.address.city =city;
    this.address.state = state;
    this.address.country = country;
     const number = Number(pincode)
     this.address.postcode = number;
     this.address.suburb = suburb;
     this.address.locality = locality
     this.address.streetName = streetName;
     this.address.streetNumber = streetNumber;
    // console.log("City:", city);
    // console.log("State:", state);
    // console.log("Country:", country);
    // console.log("Pincode:", pincode);
    // console.log("streetName:", streetName);
    // console.log("streetNumber:", streetNumber);
    // console.log("suburb:", suburb);
  }

  extractComponent(components: any[], type: string): string {
    // console.log("Type:", type);
    // console.log("Components Array:", components);

    const component = components.find((comp) => comp.types.includes(type));
    return component ? component.long_name : '';
  }
  getAllCities() {
    this.listingService
      .getAllCityListByNameByBusinessType("Accommodation")
      .subscribe(
        (response) => {
          if (response.body.length > 0) {
            this.cities = response.body;
            // this.citiesFilter = response.body;

            this.isAddressSearch = true;
            this.cities.reverse();
          } else {
            this.isAddressSearch = false;
          }

          this.changeDetectorRefs.detectChanges();
        },
        // (error) => {
        //   Logger.log("error " + JSON.stringify(error));
        // }
      );
  }
  onSelectCity(city) {
    // console.log("city is " +city);

    this.searchResultCity = city;
    this.isAddressSearch = false;

    let cityArr =[]
    cityArr= this.searchResultCity.split(",");
    // console.log("only city :"+ this.searchResultCity )
    // console.log(" city array :"+  cityArr[0])
    this.address.city = cityArr[0];

    this.address.state = cityArr[1];
    this.address.country = cityArr[2];
    this.country = cityArr[2];
    this.findAllSuburbByCities(this.address.city);
    this.token.saveCountry(this.country);
    // console.log("only city :"+ this.address.city )
    // this.streetsFilter = [];
    // this.streets = [];
    // this.isAddressSearch = false;
    // this.isAddressFound = true;

    // this.city = city;

    // this.address = new Address();
    // this.onCityUpdate(city.name);
    // // this.address.streetName = this.city.name;
    // // this.address.postcode = Number(this.city.suburbs[0].postCode);

    // this.address.suburb = '';
    // // this.address.country = this.city.countryName;
    // // this.address.state = this.city.stateOrRegionName;
    // this.address.city = this.city.name;
    // this.businessUser.address = this.address;
    this.isStreetSelect = true;
    this.changeDetectorRefs.detectChanges();
  }

  async findAllSuburbByCities(city) {
    try {
      const data = await this.listingService.findAllSuburbByCities(city).toPromise();

      if (data.status === 200) {
        this.suburbsList = data.body;
        this.isShowSubUrb = true;
        this.searchResultCity = "";
      } else {
        this.isShowSubUrb = false;
      }

      // console.log("suburblist" + JSON.stringify(this.suburbsList));
    } catch (error) {
      // Handle any errors that may occur during the request
      // console.error("Error:", error);
    }

  }
  next(){
    // debugger
    // console.log("address " + JSON.stringify(this.address));
     this.businessLineDTO.address = this.address;
     this.businessLineDTO.id = this.businessLead.id
this.token.saveLeads(this.businessLineDTO);
this.listingService.saveBusinessLeads(this.businessLineDTO).subscribe(data => {
  this.businessLead = data.body;
  // this.token.saveBusinessLeadId(this.businessLead.id.toString());
  // console.log(JSON.stringify(this.businessLead))
  })

  }
  getCityBySearch(ev: any) {
    const val = ev.target.value;

    this.searchString = val;

    if (ev.key === "backspace") {
      this.citiesFilter = [];
      this.cities = [];
      this.isAddressSearch = false;
      this.isAddressFound = true;
      this.changeDetectorRefs.detectChanges();
    } else {
      if (this.searchString.length > 0) {
        debounceTime(1000);
        this.searchFilteredCities = this.cities.filter(function (str) {
          return (
            str?.toLowerCase().trim().indexOf(val.trim().toLowerCase().trim()) >
            -1
          );
        });
        // this.getCitiesBySearch(val);
        this.isAddressSearch = true;
      } else if (this.searchString.length <= 0) {
        this.citiesFilter = [];
        // this.cities = [];
        this.isAddressSearch = false;
        this.isAddressFound = true;
        this.changeDetectorRefs.detectChanges();
      }
      // this.cities = this.citiesFilter;
      // this.cities = this.citiesFilter.filter((item) => {
      //   const searchResultCity =
      //     item.name !== null &&
      //     item.name
      //       .toLowerCase()
      //       .trim()
      //       .indexOf(val.trim().toLowerCase().trim()) > -1;

      //   return searchResultCity;
      // });
    }

    if (this.cities.length > 0) {
      this.isAddressSearch = true;
    }
    // Logger.log(
    //   "cities searchFilteredCities " + JSON.stringify(this.searchFilteredCities)
    // );
  }
  onSelectSuburb(suburb) {
    // console.log("city is " +suburb);

    this.searchResultSuburb = suburb;
    // console.log("console" +this.searchResultSuburb)
    this.isAddressSearch = false;

    this.address.suburb = this.searchResultSuburb
    this.token.saveCountry(this.country);
    // console.log("only city :"+ this.address.suburb )
    // this.streetsFilter = [];
    // this.streets = [];
    // this.isAddressSearch = false;
    // this.isAddressFound = true;

    // this.city = city;

    // this.address = new Address();
    // this.onCityUpdate(city.name);
    // // this.address.streetName = this.city.name;
    // // this.address.postcode = Number(this.city.suburbs[0].postCode);

    // this.address.suburb = '';
    // // this.address.country = this.city.countryName;
    // // this.address.state = this.city.stateOrRegionName;
    // this.address.city = this.city.name;
    // this.businessUser.address = this.address;
    this.isStreetSelect = true;
    this.changeDetectorRefs.detectChanges();
  }
  getSubUrbyBySearch(ev: any) {
    // console.log("suburblist by subrub call" + JSON.stringify(this.suburbsList));
    const val = ev.target.value;

    this.searchString = val;
// console.log("search string" +this.searchString)
    if (ev.key === "backspace") {
      // this.suburbsList = [];
      this.isAddressSearch = false;
      this.isAddressFound = true;
      this.changeDetectorRefs.detectChanges();
    } else {
      if (this.searchString.length > 0) {
        debounceTime(1000);
        // console.log("suburblist" +JSON.stringify(this.suburbsList))
        this.searchFilteredCities = this.suburbsList.filter(function (str) {
          return (
            str?.toLowerCase().trim().indexOf(val.trim().toLowerCase().trim()) >
            -1
          );
        });
        // this.getCitiesBySearch(val);
        this.isAddressSearch = true;
      } else if (this.searchString.length < 0) {
        // console.log("this.searchString.length: "+);
         this.suburbsList = [];
        // this.cities = [];
        this.isAddressSearch = false;
        this.isAddressFound = true;
        this.changeDetectorRefs.detectChanges();
      }
      // this.cities = this.citiesFilter;
      // this.cities = this.citiesFilter.filter((item) => {
      //   const searchResultCity =
      //     item.name !== null &&
      //     item.name
      //       .toLowerCase()
      //       .trim()
      //       .indexOf(val.trim().toLowerCase().trim()) > -1;

      //   return searchResultCity;
      // });
    }

    if (this.cities.length > 0) {
      this.isAddressSearch = true;
    }
    // Logger.log(
    //   "cities searchFilteredCities " + JSON.stringify(this.searchFilteredCities)
    // );
  }
}

import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SubmitData } from '../dynamic-pricing/submitData';

export interface Email {

  fromEmail: string;
  toEmail: string;
  subject: string;
  message: string;

}


@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  animations: [SharedAnimations]
})
export class ContactFormComponent implements OnInit {
  serviceType = [
    {name: 'BookOne Support', value: 'BookOne Support '},
    {name: 'BookOne Demo Request', value: 'BookOne Demo Request '},
    {name: 'Integration Service', value: 'Integration Service '},
    {name: 'Product Development', value: 'Product Development '},
    {name: 'Others', value: 'Others '},
  ];
 subscriptionType = [
    {name: 'Hotel Website', value: 'Hotel Website'},
    {name: 'Booking Engine', value: 'Booking Engine'},
    {name: 'Booking Management', value: 'Booking Management'},
    {name: 'Channel Management', value: 'Channel Management'},
    {name: 'Revenue Management', value: 'Revenue Management'},
    {name: 'Analytics', value: 'Analytics'},
    {name: 'Room Management', value: 'Room Management'},
    {name: 'Bookone Mobile App', value: 'Bookone Mobile App'},
    {name: 'CRM', value: 'CRM'},
    {name: 'Multi User Setup', value: 'Multi User Setup'},
    {name: 'Online Payment Integration', value: 'Online Payment Integration'},
    {name: 'Hotel Mobile App', value: 'Hotel Mobile App'},
  ];

 staticAlertClosed: true;
  error = null;
  success: any = null;

  submitData: SubmitData;
  subjects: string[];
  term: string;
  country: string;
  noOfRoom: number;
  propertySize: string;



  constructor(private http: HttpClient,
    private acRoute: ActivatedRoute) {
    this.submitData = new SubmitData();
    this.acRoute.queryParams.subscribe(params => {

      if (params['object'] != undefined) {
        this.submitData = JSON.parse(params['object']);

        this.subscriptions = this.submitData.SubscriptionArray;
        this.subjects = ['BookOne Demo Request'];
        if (this.submitData.onmonthly === true) {
          this.term = 'Monthly';
        } else if (this.submitData.onhalfYear === true) {
          this.term = 'Half Yearly';
        } else if (this.submitData.onYear === true) {
          this.term = 'Yearly';
        } else if (this.submitData.on2Year === true) {
          this.term = '2 Year';
        } else { this.term = 'Monthly'; }
      this.country = this.submitData.country;
      this.noOfRoom = this.submitData.noOfRoom;
      if (this.submitData.propertySize === 2) {
        this.propertySize = '1 to 10 rooms';
      }if (this.submitData.propertySize === 5) {
        this.propertySize = '11 to 20 rooms';
      }if (this.submitData.propertySize === 10) {
        this.propertySize = '21 to 40 rooms';
      }if (this.submitData.propertySize === 15) {
        this.propertySize = '41 to 100 rooms';
      }
      if (this.submitData.propertySize === 20) {
        this.propertySize = '100+ rooms';
      }
      }
     });
  }
  subject: FormControl = new FormControl();
  // name: FormControl = new FormControl();
  fromEmail: FormControl = new FormControl();
  toEmail: FormControl = new FormControl();
  message: FormControl = new FormControl();
  serviceName: string ;
  subscriptions: string [];
  name: string;
  email: Email ;
  emailSuccess: Boolean ;
  form = new FormGroup({
    subject: new FormControl(),
    name: new FormControl(),
    fromEmail: new FormControl(),
    message:  new FormControl()
  });
  ngOnInit() {
    this.email = {
      fromEmail: '',
      toEmail: '',
      subject: '',
      message: ''
    };

  }

  submitForm(form: NgForm) {
    console.log("this is cliked ");
    console.log(JSON.stringify(this.subscriptions));
    const TO_EMAIL = 'samaya.muduli@credencesoft.co.nz';

    const API_URL = 'https://api.bookonelocal.in/api-bookone/';



    this.email.fromEmail = form.value.email;
    this.email.toEmail = TO_EMAIL;
    this.name = form.value.name;

    this.serviceName = '' + this.subscriptions;

    this.email.message = 'Name: ' + this.name + '\nEmail: ' + form.value.email + ' \nSelected Subscriptions: ' + this.serviceName + ' \nSubscriptions Term: ' + this.term + ' \nCountry: ' + this.country + ' \nProperty Size: ' + this.propertySize + ' \nNo Of Rooms: ' + this.noOfRoom + ' \nMessage: ' + form.value.message + '. \n*****this message is sent from BookOnePMS Website.******';

    console.log(this.subscriptions + ' ' + this.name);
    this.email.subject = '' + this.subjects ;
    console.log('form data ' + JSON.stringify(this.email));

   this.http.post<Email>(API_URL + 'api/website/sendEmailFromWebSite', this.email ).
   subscribe(response => {
    this.success = response;
    console.log(response);
   });
  }

}

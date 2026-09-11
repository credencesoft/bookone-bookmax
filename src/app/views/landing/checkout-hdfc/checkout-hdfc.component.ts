import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Payment } from 'src/app/model/payment';
import { BusinessUser } from 'src/app/model/user';
import { TokenStorage } from 'src/token.storage';

@Component({
  selector: 'app-checkout-hdfc',
  templateUrl: './checkout-hdfc.component.html',
  styleUrls: ['./checkout-hdfc.component.css']
})
export class CheckoutHdfcComponent implements OnInit {

  businessUser: BusinessUser;
  payment: Payment;
  loading: boolean = true;

  constructor(
    private token: TokenStorage,
    private router: Router
  ) {
    this.businessUser = new BusinessUser();
    this.payment = new Payment();

    this.businessUser = this.token.getPropertyData();
    if (this.businessUser && this.businessUser.primaryColor !== undefined) {
      this.changeTheme(
        this.businessUser.primaryColor,
        this.businessUser.secondaryColor,
        this.businessUser.tertiaryColor
      );
    }
    this.payment = this.token.getPaymentData();
  }

  ngOnInit(): void {
    if (this.payment && this.payment.encryptedData && this.businessUser && this.businessUser.paymentGatewayPublicKey) {
      this.initiateHdfcPayment();
    } else {
      this.loading = false;
      console.error('HDFC Payment data or property key missing', this.payment, this.businessUser);
    }
  }

  changeTheme(primary?: string, secondary?: string, tertiary?: string) {
    const defaultPrimary = "#232A45";   // blue
    const defaultSecondary = "#0B01CC"; // green
    const defaultTertiary = "#fff";  // yellow

    const p = primary || defaultPrimary;
    const s = secondary || defaultSecondary;
    const t = tertiary || defaultTertiary;

    document.documentElement.style.setProperty('--primary', p);
    document.documentElement.style.setProperty('--secondary', s);
    document.documentElement.style.setProperty('--tertiary', t);
    document.documentElement.style.setProperty('--button-primary', t);

    document.documentElement.style.setProperty(
      '--primary-gradient',
      `linear-gradient(180deg, ${t}, ${s})`
    );
    document.documentElement.style.setProperty(
      '--secondary-gradient',
      `linear-gradient(312deg, ${p}, ${s})`
    );
    document.documentElement.style.setProperty(
      '--secondary-one-gradient',
      `linear-gradient(180deg, ${p}, ${s})`
    );
    document.documentElement.style.setProperty(
      '--third-gradient',
      `linear-gradient(180deg, ${p}, ${s})`
    );
  }

  initiateHdfcPayment() {
    const actionUrl = 'https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction';

    console.log('Initiating CCAvenue/HDFC Payment (Production URL):', {
      actionUrl,
      access_code: this.businessUser.paymentGatewayPublicKey,
      merchant_id: this.businessUser.paymentGatewayApiKey,
      encryptedDataLength: this.payment.encryptedData ? this.payment.encryptedData.length : 0
    });

    // Create a form dynamically and submit it via POST
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = actionUrl;

    const encRequestInput = document.createElement('input');
    encRequestInput.type = 'hidden';
    encRequestInput.name = 'encRequest';
    encRequestInput.value = this.payment.encryptedData;
    form.appendChild(encRequestInput);

    const accessCodeInput = document.createElement('input');
    accessCodeInput.type = 'hidden';
    accessCodeInput.name = 'access_code';
    accessCodeInput.value = this.businessUser.paymentGatewayPublicKey;
    form.appendChild(accessCodeInput);

    // If merchant_id is present, send it as a parameter as some environments require it
    if (this.businessUser.paymentGatewayApiKey) {
      const merchantIdInput = document.createElement('input');
      merchantIdInput.type = 'hidden';
      merchantIdInput.name = 'merchant_id';
      merchantIdInput.value = this.businessUser.paymentGatewayApiKey;
      form.appendChild(merchantIdInput);
    }

    document.body.appendChild(form);
    form.submit();
  }


  onGoHome() {
    this.router.navigate(['/']);
  }
}

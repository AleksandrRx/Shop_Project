import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ShopFormService} from "../../services/shop-form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[];
  states: State[];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  checkoutFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private shopFormService: ShopFormService,
              private cartService:CartService) {
  }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [""],
        lastName: [""],
        email: [""]
      }),
      shippingAddress: this.formBuilder.group({
        street: [""],
        city: [""],
        state: [""],
        country: [""],
        zipCode: [""]
      }),
      billingAddress: this.formBuilder.group({
        street: [""],
        city: [""],
        state: [""],
        country: [""],
        zipCode: [""]
      }),
      creditCard: this.formBuilder.group({
        cardType: [""],
        nameOnCard: [""],
        cardNumber: [""],
        securityCode: [""],
        expirationMonth: [""],
        expirationYear: [""]
      })
    });

    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth = " + startMonth);
    this.shopFormService.getCreditCardMonths(startMonth).subscribe(data => {
      console.log("Retrieved credit card months: " + JSON.stringify(data));
      this.creditCardMonths = data;
    });

    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years:" + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    this.shopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
    this.updateTotals();
  }

  onSubmit() {
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("The Email address is " + this.checkoutFormGroup.get('customer').value.email);

    console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log("The shipping address state is " + this.checkoutFormGroup.get('shippingAddress').value.state.name);


  }

  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
    }

  }

  handleMonthsAndYears(event) {
    const creditCardFormGroup = this.checkoutFormGroup.get("creditCard");
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = creditCardFormGroup.value.expirationYear;
    console.log("Current year is: " + event.target.value);
    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.shopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName == 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }
        formGroup.get('state').setValue(data[0]);
      }
    );
  }

  updateTotals(){
    this.cartService.totalPrice.subscribe(data=> this.totalPrice=data);
    this.cartService.totalQuantity.subscribe(data=> this.totalQuantity = data);
    this.cartService.computeCartTotals();
  }
}

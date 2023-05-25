import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { cart, order } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{
  totalPrice:undefined|number;
  cartData:cart[]|undefined
  orderMsg: string | undefined;

  constructor(private product:ProductService, private router:Router){}
  ngOnInit(): void {
    this.product.currentCart().subscribe((result)=>{
      let price = 0;
      this.cartData=result
      result.forEach((item) => {
        if (item.quantity) {
          price = price + (+item.price * +item.quantity)
        }
      })
      this.totalPrice= price + (price / 10) + 100 - (price / 10);
      console.log(this.totalPrice)
    })
  }

  orderNow(data:{ email: string, address: string, contact: string }){
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    console.log(data)
    if(this.totalPrice){
      let orderData:order={
        ...data,
        totalPrice:this.totalPrice,
        userId,
        id:undefined
      }

      // order place krne ke badd cart kko empty krna h to ess liye hume ye loop me chalan pdega
      this.cartData?.forEach((item)=>{
        setTimeout(() => {
          // item.id proper hai tabhi ye kam kre
         item.id && this.product.deleteCartItems(item.id)
        }, 1000);
      })

      this.product.orderNow(orderData).subscribe((result)=>{
        // console.log(result)
        if(result){
          // alert("order palced")
          this.orderMsg="Your Order have been placed"
          setTimeout(() => { 
            this.router.navigate(['/my-orders'])
            this.orderMsg=undefined
          }, 4000);
        }
      })
    }

  }
}

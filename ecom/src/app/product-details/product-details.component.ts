import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { cart, product } from '../data-type';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit{

  productData:undefined| product;
  productQuantity:number=1;
  removeCart=false
  cartData:product|undefined;
  constructor(private activeRoute:ActivatedRoute, private product:ProductService){} // ye ActivatedRoute params me se id ya kkuch bhi get krne ke liye hota h


  ngOnInit(): void {
      let productId=this.activeRoute.snapshot.paramMap.get("productId")

      productId && this.product.getProduct(productId).subscribe((result)=>{
        console.log(result)
        this.productData=result
      })

      let cartData=localStorage.getItem('localCart')
      if(productId && cartData){
        // ye hum ess liye krr rhe h kyuki hume localStore me se same product ko repeat nhi krvana h
        let items=JSON.parse(cartData)
        items=items.filter((item:product)=>productId==item.id.toString())
        // ye sub remove to cart button ke liye ho rha h
        if(items.length){
          this.removeCart=true
        }
        else{
          this.removeCart=false
        }
      }

      // navbar ko update krne ke liye h jab user login kre
      let user=localStorage.getItem("user")
      if(user){
        let userId=user && JSON.parse(user).id
        this.product.getCartList(userId)
        this.product.cartData.subscribe((result)=>{
          //jitne bhi items match hue h humare dataBase se
         let item= result.filter((item:product)=>productId?.toString()===item.productId?.toString())
         if(item.length){
          this.cartData=item[0] // yaha pr hum single prodcut get krr rhe h jo hume agge remove to cart me help krega
          this.removeCart=true
         }
        })
      }
  }

  handleQuantity(val:string){
    if(this.productQuantity<20 && val==="plus"){
      this.productQuantity++
    }
    else if(this.productQuantity>1 && val==='min'){
      this.productQuantity--
    }
  }

  AddToCart(){
    if(this.productData){
      this.productData.quantity=this.productQuantity
      
      if(!localStorage.getItem('user')){// user Login Nhi hai to ye kro
        // console.log(this.productData);
        this.product.localAddToCart(this.productData)
        this.removeCart=true // add to cart button pr click krne ke badd remove to cart button show krne ke liye ye kra h
      }
      else{
        // user login h to ye kro
        let user=localStorage.getItem("user")
        let userId=user && JSON.parse(user).id
        let cartData:cart={
          ...this.productData,
          userId,
          productId:this.productData.id, // ye humne ess liye kiya kyuki yaha pr jo id millegi vo hume product ki Id millegi or jub hum add to cart kre ge toh vo dono same ho jayegi to problem create hogi
        }

        delete cartData.id; // ye product ki id ko delete krne ke liye h

        // abb yaha addToCart api me post krr denge
        this.product.addToCart(cartData).subscribe((result)=>{
          console.log(result)
          if(result){
            this.product.getCartList(userId)
            this.removeCart=true
          }
        })
      }
    }
  }

  removeToCart(productId:number){
    if(!localStorage.getItem('user')){// user Login Nhi hai to ye kro
      this.product.removeItemFromCart(productId)
    }
    else{
      let user=localStorage.getItem("user")
      let userId=user && JSON.parse(user).id
      // aggr cart data define h toh yi he kam kre verna na kre 
      this.cartData && this.product.removeToCart(this.cartData.id).subscribe((result)=>{
        if(result){
          this.product.getCartList(userId)
        }
      })
    }
    this.removeCart=false // ye button ko change krne ke lye h jabb hum add to cart kre to remove to cart dekhna chiye na click ke badd and same jab remove to cart kre to "add to cart" dekhan chiye
  }
}

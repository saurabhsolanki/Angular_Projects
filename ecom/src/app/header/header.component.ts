import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menuType:string="default";
  sellerName:string='';
  userName:string=''
  searchResult:undefined | product[]
  cartItem=0;
  constructor(private route:Router,private product:ProductService){}

  ngOnInit(): void {
    // jab bhi route/link me change hoga muje uski value milegi
    this.route.events.subscribe((val:any)=>{
      console.log(val.url)
      if(val.url){
        if(localStorage.getItem("seller") && val.url.includes("seller")){
          // console.log("inside seller")
          this.menuType='seller'
          if(localStorage.getItem("seller")){
            let sellerStore=localStorage.getItem('seller')
            let sellerData=sellerStore && JSON.parse(sellerStore)[0]
            this.sellerName=sellerData.name
          }
        }
        else if(localStorage.getItem('user')){
          let userStore=localStorage.getItem('user')
          let userData=userStore && JSON.parse(userStore)
          this.userName=userData.name
          this.menuType='user'
          this.product.getCartList(userData.id) // ye navbar me cart ke number ko  update krne ke liye h jab user login ho
        }
        else{
          // console.log("outside seller")
          this.menuType='default'
        }
      }
    }) 

    let cartData=localStorage.getItem("localCart")
    if(cartData){
      this.cartItem=JSON.parse(cartData).length
    }

    // ye uss ke liye h jab me hum add to cart kre to hume page refresh na krna pde automatic ho jaye to uske liye hum eventEmiiter se subscribe krege
    this.product.cartData.subscribe((items)=>{
      this.cartItem=items.length
    })
  }

  logout(){
    localStorage.removeItem("seller");
    this.route.navigate(["/"])
  }
  userLogout(){
    localStorage.removeItem("user")
    this.route.navigate(['/user-auth'])
    // logout ke badd cart me vlaue Zero dekhane ke liye 
    this.product.cartData.emit([])
  }

  searchProduct(query:KeyboardEvent){
    if(query){
      const element=query.target as HTMLInputElement
      // console.log(element.value)
      this.product.searchProduct(element.value).subscribe((result)=>{
        // console.log("res",result)
        if(result.length>5){
          // fixing the length of reslult
          result.length=5          
        }
        this.searchResult=result;
      })
    }
  }

  // ye function uss chij ke liye h jab hum search box se bhar click kr or hume search reslut ko gayab krna ho
  hideSearch(){
    this.searchResult=undefined
  }

  submitSearch(val:string){
    console.log(val)
    this.route.navigate([`search/${val}`])
  }

  // navbar me list show ho rhi h unpr click krne pr ye hume single product page(product detail) pr le jayega - ye mousedown ki help se hua h
  // kyuki jab blur event laga hota h toh click event kam nhi krta

  redirectToDetails(id:number){
    this.route.navigate(["/details/"+id])
  }


}

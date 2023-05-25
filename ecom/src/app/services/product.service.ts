import { cart, order, product } from './../data-type';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  cartData= new EventEmitter<product [] | []>()
  constructor(private http:HttpClient, private router:Router) { }

  addProduct(data:product){
    console.log("service called")
    return this.http.post('http://localhost:3000/products',data);
  }

  productList(){
    return this.http.get<product[]>("http://localhost:3000/products");
  }

  deleteProduct(id:number){
    return this.http.delete(`http://localhost:3000/products/${id}`);
  }

  getProduct(id:string){
    return this.http.get<product>(`http://localhost:3000/products/${id}`);
  }

  updateProduct(product:product){
    return this.http.put<product>(`http://localhost:3000/products/${product.id}`,product);  
  }

  popularProducts(){
    return this.http.get<product[]>("http://localhost:3000/products?_limit=3");
  }

  trendyProducts(){
    return this.http.get<product[]>("http://localhost:3000/products?_limit=8");  
  }

  searchProduct(query:string){
    return this.http.get<product[]>(`http://localhost:3000/products?q=${query}`);
  }

  localAddToCart(data:product){
    let CartData=[]
    let localCart=localStorage.getItem('localCart')
    if(!localCart){ // aggr cart empty hai to ye kro mtlb ki localstore me vo data dall do
      localStorage.setItem("localCart",JSON.stringify([data]))
      this.cartData.emit([data])//first time cart me kuch value add krr rhe h uss time ke liye
    }
    else{
      // aggr vo data already h localStorage me to ye kro mtlb ki local store me vo data dobara dall do
      CartData=JSON.parse(localCart)
      CartData.push(data)
      localStorage.setItem("localCart",JSON.stringify(CartData))
    }
    this.cartData.emit(CartData)
  }

  // ye localstorage se remove krne ke lye h jab user login nhi hoga
  removeItemFromCart(productId:number){
    let cartData=localStorage.getItem('localCart')
    if(cartData){
      let items:product[]=JSON.parse(cartData)
      items=items.filter((item:product)=>productId!==item.id)
      // console.log(items)
      localStorage.setItem("localCart",JSON.stringify(items))
      this.cartData.emit(items) // header ko update krne ke liye
    }
  }

  addToCart(cartData:cart){
    return this.http.post('http://localhost:3000/cart',cartData);
  }

  // geting cart item of logged in user ApI
  getCartList(userId: number){
    return this.http.get<product[]>('http://localhost:3000/cart?userId=' + userId, {observe: 'response',})
    .subscribe((result)=>{
      if(result && result.body){// check krne ke liye khai result ki body undefined na ho --- result.body kam krta h as res.data in react in axiox
        this.cartData.emit(result.body)
      }
    })
  }

  // ye api se remove krne ke liye h jab user login hoga
  removeToCart(cartId:number){
    return this.http.delete('http://localhost:3000/cart/'+cartId)
  }

  currentCart(){
    let userStore=localStorage.getItem('user')
    let userData=userStore && JSON.parse(userStore)
    return this.http.get<cart[]>('http://localhost:3000/cart?userID='+userData.id)
  }

  orderNow(data:order){
    return this.http.post("http://localhost:3000/orders",data)
  }

  orderList() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<order[]>('http://localhost:3000/orders?userId=' + userData.id);
  }

  deleteCartItems(cartId: number) {
    return this.http.delete('http://localhost:3000/cart/' + cartId,{observe: 'response'}).subscribe((result) => {
      if(result){
        this.cartData.emit([]);
      }
    })
  }

  cancelOrder(orderId:number){
    return this.http.delete('http://localhost:3000/orders/'+orderId)

  }
}

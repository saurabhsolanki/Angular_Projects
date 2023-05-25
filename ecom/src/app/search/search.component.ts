import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchResult:undefined | product[]
 
  //  ye active route params me se query get krne ke liye h
  constructor(private activeRoute:ActivatedRoute, private product:ProductService){}

  ngOnInit():void{
    let query=this.activeRoute.snapshot.paramMap.get('query'); //ye "query" same routing module file vale path vali honi chiye mtlb :query or eski dono ki same speeling honi chiye
    console.log("query",query);
    query && this.product.searchProduct(query).subscribe((result)=>{
      this.searchResult=result;
    })
  }
}

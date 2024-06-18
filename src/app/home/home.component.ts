import { Component, OnInit, Signal, computed, inject, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { BudgetService } from '../services/budget.service';
import { Product } from '../models/budget';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  products!: Product[];
  totalPrice: number = 0;

  budgetForm = new FormGroup({});

  constructor(private budgetService: BudgetService) { }

  ngOnInit() {
    this.products = this.budgetService.getProducts();

    this.products.forEach(product => {
      this.budgetForm.addControl(product.controlName, new FormControl(false));
    });

    this.budgetForm.valueChanges.subscribe(values => {
      console.log(values);
      this.calculateTotalPrice();
    });
  }

  calculateTotalPrice() {
    this.totalPrice = this.products
      .filter(product => this.budgetForm.get(product.controlName)?.value)
      .reduce((total, product) => total + product.price, 0);
  }
}

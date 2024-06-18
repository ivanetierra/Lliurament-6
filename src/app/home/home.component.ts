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
export class HomeComponent implements OnInit {
  products!: Product[];
  budgetForm: FormGroup = new FormGroup({});
  formValues = signal(this.budgetForm.value);
  totalPrice = computed(() => {
    return this.products
      .filter(product => this.formValues()[product.controlName])
      .reduce((total, product) => total + product.price, 0);
  });

  constructor(private budgetService: BudgetService) { }

  ngOnInit() {
    this.products = this.budgetService.getProducts();

    this.products.forEach(product => {
      this.budgetForm.addControl(product.controlName, new FormControl(false));
    });

    this.budgetForm.valueChanges.subscribe(values => {
      this.formValues.set(values);
    });
  }
}

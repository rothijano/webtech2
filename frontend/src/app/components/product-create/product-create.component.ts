import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductDto } from 'src/app/_models/product.dto';
import { Product } from 'src/app/_models/product.model';
import { ProductService } from 'src/app/_services/product.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {
  public product!: Product;
  public form!: FormGroup;

  public activeStatus: any = [
    { value: true, viewValue: 'Active' },
    { value: false, viewValue: 'Inactive' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.maxLength(250)],
      quantity: ['', [Validators.required, Validators.min(0)]],
      price: ['', [Validators.required, Validators.min(0)]],
      isActive: ['', Validators.required],
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    this.productService.create(this.form.value).subscribe(() => {
      this.snackBar.open('The product has been successfully created!', undefined, { duration: 7.5 * 1000 });
      this.router.navigateByUrl("/products");
    });
  }

  back() {
    this.router.navigateByUrl("/products");
  }
}

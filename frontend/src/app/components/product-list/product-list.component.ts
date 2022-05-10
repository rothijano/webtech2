import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductDto } from 'src/app/_models/product.dto';
import { Product } from 'src/app/_models/product.model';
import { ProductService } from 'src/app/_services/product.service';
import { DeleteDialogComponent } from '../_dialogs/delete.dialog/delete.dialog.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  columnsToDisplay = ['name', 'description', 'quantity', 'price', 'isActive', 'creator', 'menu'];

  constructor(public productService: ProductService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.refresh();
  }

  private refresh() {
    this.productService.getAll().subscribe(products => {
      this.products = products;
    });
  }

  getUploader(data: Product, name: string): string {
    return data.creator.username;
  }

  deleteProduct(product: Product) {
    const dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === "submit") {
        this.productService.delete(product._id).subscribe(() => {
          this.refresh();
        })
      }
    });
  }
}

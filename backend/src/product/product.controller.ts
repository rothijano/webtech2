import { Request, Response, NextFunction, Router } from 'express';
import { isValidObjectId } from 'mongoose';
import ProductNotFoundException from '../exceptions/ProductNotFoundException';
import Controller from '../interfaces/controller.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import CreateProductDto from './product.dto';
import Product from './product.interface';
import productModel from './product.model';

class ProductController implements Controller {
  public path = '/product';
  public router = Router();
  private product = productModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .all(`${this.path}*`, authMiddleware)
      .get(this.path, this.getAllProducts)
      .get(`${this.path}/:id`, this.getProductById)
      .put(`${this.path}/:id`, validationMiddleware(CreateProductDto, true), this.modifyProduct)
      .delete(`${this.path}/:id`, this.deleteProduct)
      .post(this.path, authMiddleware, validationMiddleware(CreateProductDto), this.createProduct);
  }

  private getAllProducts = async (request: Request, response: Response) => {
    const products = await this.product.find().populate('creator', '-password');

    response.send(products);
  }

  private getProductById = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;

    if (isValidObjectId(id)) {
      const product = await this.product.findById(id);

      if (product) {
        await product.populate('creator', '-password').execPopulate();
        response.send(product);
        return;
      }
    }

    next(new ProductNotFoundException(id));
  }

  private modifyProduct = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const productData: CreateProductDto = request.body;
    const product = await this.product.findByIdAndUpdate(id, productData, { new: true });

    await product.populate('creator', '-password').execPopulate();

    if (product) {
      response.send(product);
    } else {
      next(new ProductNotFoundException(id));
    }
  }

  private createProduct = async (request: RequestWithUser, response: Response) => {
    const productData: CreateProductDto = request.body;
    const createdProduct = new this.product({
      ...productData,
      creator: request.user._id,
    });
    const savedProduct = await createdProduct.save();

    await savedProduct.populate('creator', '-password').execPopulate();

    response.send(savedProduct);
  }

  private deleteProduct = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const successResponse = await this.product.findByIdAndDelete(id);

    if (successResponse) {
      response.status(200).send({});
    } else {
      next(new ProductNotFoundException(id));
    }
  }
}

export default ProductController;

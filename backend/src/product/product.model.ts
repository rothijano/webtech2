import * as mongoose from 'mongoose';
import Product from './product.interface';

const productSchema = new mongoose.Schema({
  creator: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
  },
  name: String,
  description: String,
  quantity: Number,
  price: Number,
  isActive: Boolean
});

const productModel = mongoose.model<Product & mongoose.Document>('Product', productSchema);

export default productModel;

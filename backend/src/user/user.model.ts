import * as mongoose from 'mongoose';
import User from './user.interface';

const userSchema = new mongoose.Schema(
  {
    username: String,
    password: {
      type: String,
      get: (): undefined => undefined,
    },
  },
  {
    toJSON: {
      virtuals: false,
      getters: true
    },
  },
);

userSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'creator'
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;

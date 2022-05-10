import * as bcrypt from 'bcrypt';
import config from '../config';
import * as jwt from 'jsonwebtoken';
import UserAlreadyExistsException from '../exceptions/UserAlreadyExistsException';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import TokenData from '../interfaces/tokenData.interface';
import CreateUserDto from '../user/user.dto';
import User from '../user/user.interface';
import userModel from './../user/user.model';

class AuthenticationService {
  public user = userModel;

  public async register(userData: CreateUserDto) {
    if (
      await this.user.findOne({ username: userData.username })
    ) {
      throw new UserAlreadyExistsException(userData.username);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.user.create({
      ...userData,
      password: hashedPassword,
    });
    const tokenData = this.createToken(user);
    const cookie = this.createCookie(tokenData);

    return {
      cookie,
      user,
    };
  }

  public createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; Path=/;`;
  }

  public createToken(user: User): TokenData {
    const expiresIn = 60 * 60; // an hour
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
    };
    
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, config.server.secret, { expiresIn }),
    };
  }
}

export default AuthenticationService;

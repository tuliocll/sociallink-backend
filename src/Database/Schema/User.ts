import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import LinkInterface from '../../App/Interfaces/LinkInterface';

export interface UserInterface extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  tokens: [string];
  links: [LinkInterface];
  generateAuthToken(): string;
  findByCredentials(): UserInterface;
}

const UserSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    links: [
      {
        name: String,
        url: String,
        enabled: Boolean,
        clicks: Number,
        image: String,
        position: Number,
      },
    ],
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Gerar o hash da senha antes de salvar
UserSchema.pre<UserInterface>('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Gerar token para o usuario
UserSchema.methods.generateAuthToken = async function() {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  const token: string = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// Pesquisar pelo usuario pelo nome e senha (login)
UserSchema.statics.findByCredentials = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid login credentials1');
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error('Invalid login credentials2');
  }
  return user;
};

const User = model<UserInterface>('User', UserSchema);

export default User;

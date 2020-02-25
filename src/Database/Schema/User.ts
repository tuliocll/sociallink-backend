import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { UserInterface } from '../../App/Interfaces';

const UserSchema = new Schema(
  {
    name: String,
    usernick: String,
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
// TODO: mover essa regra pra um controller de auth
UserSchema.statics.findByCredentials = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Usuario não encontrado');
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error('Usuario não encontrado');
  }
  return user;
};

const User = model<UserInterface>('User', UserSchema);

export default User;

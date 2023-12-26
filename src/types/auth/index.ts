import { UserType } from '@prisma/client';

export interface SignupParams {
  email: string;
  phone: string;
  password: string;
  name: string;
  user_type: UserType;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface GenerateProductKeyParams {
  email: string;
  userType: UserType;
}

export interface GenerateAuthTokenParams {
  id: number;
  userType: UserType;
}

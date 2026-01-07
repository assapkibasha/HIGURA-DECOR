export type JwtPayload = {
  sub: string;
  role: 'admin' | 'user';
};

export type AuthenticatedUser = {
  id: string;
  role: 'admin' | 'user';
};

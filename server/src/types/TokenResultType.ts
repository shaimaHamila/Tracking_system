export type TokenResultType = {
  accessToken: string;
  refreshToken?: string;
  userTokenExpiration?: Date;
  refreshTokenExpiration?: Date;
};

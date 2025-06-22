export class TokensPresenter {
  static toHTTP({ accessToken }: { accessToken: string }) {
    return {
      access_token: accessToken,
    };
  }
}

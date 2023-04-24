import { JWT } from 'next-auth/jwt';
import { Account } from 'next-auth';

interface RedditTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export default async function refreshAccessToken(token: JWT): Promise<JWT> {
    if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
        }
  try {
    const account = token.account as Account;
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: (account.refreshToken as string),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh access token: ${response.status} ${response.statusText}`);
    }

    const data: RedditTokenResponse = await response.json();

    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: Date.now() + data.expires_in * 1000,
      refreshToken: data.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error('Failed to refresh access token', error);
    return {
        ...token,
        error: 'refreshAccessTokenError'
    }
  }
}

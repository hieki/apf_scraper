interface Config {
    consumer_key: string;
    consumer_secret: string;
    access_token: string;
    access_token_secret: string;
}
export function config(): Config {
  return {
    consumer_key: process.env['consumer_key'],
    consumer_secret: process.env['consumer_secret'],
    access_token: process.env['access_token'],
    access_token_secret: process.env['access_token_secret']
  }
}

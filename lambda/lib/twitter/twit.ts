import * as Twit from "twit";
import {config} from "./config";

export class Tweeter {
  private twitterClient: Twit;

  public constructor() {
    const twitOptions: Twit.Options = {} as Twit.Options;
    const conf = config();
    twitOptions.consumer_key = conf.consumer_key || "";
    twitOptions.consumer_secret = conf.consumer_secret || "";
    twitOptions.access_token = conf.access_token;
    twitOptions.access_token_secret = conf.access_token_secret;
    twitOptions.timeout_ms = 60 * 1000;
    this.twitterClient = new Twit(twitOptions);
  }

  public async post(tweet: Twit.Params): Promise<Twit.PromiseResponse> {
    return await this.twitterClient.post("statuses/update", tweet);
  }

}

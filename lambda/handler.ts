import { Callback, CloudWatchLogsEvent, Context, Handler } from "aws-lambda";
import {DynamoDBClient} from "./lib/aws/dynamodb";
import {DynamoDB} from "aws-sdk";
import {Tweeter} from "./lib/twitter/twit";

export const tweet: Handler = async (event: CloudWatchLogsEvent, context: Context, cb: Callback) => {
  console.log(`event: ${event}`);
  const dynamo: DynamoDBClient = new DynamoDBClient();
  const maxIdItems: any = await dynamo.query(
    {
      ExpressionAttributeValues: {
        ":hkey": "afp_articles",
      },
      KeyConditionExpression: "table_name = :hkey",
      TableName: "sequences",
    },
  );
  const maxId: number = maxIdItems.Items[0].value;
  const id: number = Math.floor(Math.random() * (maxId - 0) + 0);
  console.log(id);
  const postArticle: DynamoDB.DocumentClient.QueryOutput = await dynamo.query(
    {
      ExpressionAttributeValues: {
        ":hkey": id,
      },
      KeyConditionExpression: "id = :hkey",
      TableName: "afp_articles",
    },
  );
  console.log(`We should post tweet about this article! ${JSON.stringify(postArticle)}`);
  const article = postArticle.Items[0];
  const title: string = article.raw_title;
  const body: string = article.body.slice(0, 50);
  const href: string = article.href;
  const tw: Tweeter = new Tweeter();
  const post: string = `{title}: ${body}... ${href}`;
  console.log(post);
  tw.post({status: post});

  const response = {
    body: JSON.stringify({
      input: event,
      message: "shit.",
    }),
    statusCode: 200,
  };

  cb(null, response);
};

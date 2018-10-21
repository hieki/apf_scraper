import {DynamoDB} from "aws-sdk";
type DC = DynamoDB.DocumentClient;

export class DynamoDBClient {
  private client: DC;

  public constructor() {
    this.client = new DynamoDB.DocumentClient({region: "ap-northeast-1"});
  }

  public async query(params: DynamoDB.DocumentClient.QueryInput): Promise<DynamoDB.DocumentClient.QueryOutput> {
    return await this.client.query(params).promise();
  }

  public async scan(params: DynamoDB.DocumentClient.ScanInput): Promise<DynamoDB.DocumentClient.ScanOutput> {
    return await this.client.scan(params).promise();
  }
  // tslint:disable-next-line:max-line-length
  public async update(params: DynamoDB.DocumentClient.UpdateItemInput): Promise<DynamoDB.DocumentClient.UpdateItemOutput> {
    return await this.client.update(params).promise();
  }

  public async put(params: DynamoDB.DocumentClient.PutItemInput): Promise<DynamoDB.DocumentClient.PutItemOutput> {
    return await this.client.put(params).promise();
  }
}

require 'aws-sdk'

module AWS
  class DynamoDB
    def dynamodb_client(region = 'ap-northeast-1')
      Aws::DynamoDB::Resource.new(region: region)
    end

    def get_table(table_name)
      dynamodb_client(table_name)
    end
  end
end

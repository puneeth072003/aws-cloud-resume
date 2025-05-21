import os
import json
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
sns = boto3.client('sns')

TABLE_NAME = os.environ['TABLE_NAME']
SNS_TOPIC_ARN = os.environ['SNS_TOPIC_ARN']
VIEW_THRESHOLD = int(os.environ['VIEW_THRESHOLD'])
SECRET_KEY = os.environ['SECRET_KEY']

table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    params = event.get("queryStringParameters") or {}

    # Secret key check
    if params.get("key") != SECRET_KEY:
        return {
            "statusCode": 403,
            "body": json.dumps({"error": "Forbidden"})
        }

    page = "home"

    try:
        if event["httpMethod"] == "POST":
            resp = table.update_item(
                Key={'page': page},
                UpdateExpression='ADD #c :inc',
                ExpressionAttributeNames={'#c': 'count'},
                ExpressionAttributeValues={':inc': 1},
                ReturnValues="UPDATED_NEW"
            )
            count = int(resp["Attributes"]["count"])

            # Alert if count == threshold
            if count == VIEW_THRESHOLD:
                sns.publish(
                    TopicArn=SNS_TOPIC_ARN,
                    Subject="🚨 Page View Threshold Reached",
                    Message=f"Page '{page}' has reached {count} views."
                )

        else:  # GET
            resp = table.get_item(Key={'page': page})
            count = int(resp.get("Item", {}).get("count", 0))

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"views": count})
        }

    except ClientError as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

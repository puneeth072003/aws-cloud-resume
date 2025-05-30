import os, json, boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
sns      = boto3.client('sns')

TABLE_NAME      = os.environ['TABLE_NAME']
SNS_TOPIC_ARN   = os.environ['SNS_TOPIC_ARN']
# VIEW_THRESHOLD  = int(os.environ['VIEW_THRESHOLD'])
VIEW_THRESHOLD  = 100
SECRET_KEY      = os.environ['SECRET_KEY']

table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    http_method = (
        event.get("httpMethod")
        or event.get("requestContext", {})
                 .get("http", {})
                 .get("method")
    )
    
    # 2) CORS preflight
    if http_method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            "body": json.dumps({"message": "CORS OK"})
        }

    # 3) Extract secret-key param
    params = event.get("queryStringParameters") or {}
    if params.get("key") != SECRET_KEY:
        return {
            "statusCode": 403,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "Forbidden"})
        }

    page = "home"
    try:
        if http_method == "POST":
            # increment counter
            resp = table.update_item(
                Key={'page': page},
                UpdateExpression='ADD #c :inc',
                ExpressionAttributeNames={'#c': 'count'},
                ExpressionAttributeValues={':inc': 1},
                ReturnValues="UPDATED_NEW"
            )
            count = int(resp["Attributes"]["count"])

            if count == VIEW_THRESHOLD:
                sns.publish(
                    TopicArn=SNS_TOPIC_ARN,
                    Subject = "🚨 Portfolio Alert: Page View Threshold Reached",
                    Message = f"""
                    Dear Team,

                    We are writing to inform you that your portfolio page '{page}' has reached a significant milestone, with the total view count hitting {count} views.

                    This threshold crossing indicates increased interest in this section of your portfolio. It may be a good time to:
                    - Review the content for potential updates or optimizations,
                    - Ensure all links and assets are working as expected,
                    - Consider promoting or analyzing traffic sources.

                    If this page is part of an ongoing campaign, we recommend tracking further engagement metrics to assess user behavior and interest levels.

                    Best regards,  
                    Portfolio Monitoring System  
                    """
                )
        else:
            # GET/fallback: read counter
            resp  = table.get_item(Key={'page': page})
            count = int(resp.get("Item", {}).get("count", 0))

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            "body": json.dumps({"views": count})
        }

    except ClientError as e:
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": str(e)})
        }

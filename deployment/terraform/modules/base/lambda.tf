resource "aws_lambda_function" "view_counter" {
  function_name = "viewCounterFunction"
  runtime       = "python3.12"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "main.lambda_handler"

  filename         = var.file_path
  source_code_hash = filebase64sha256(var.file_path)

  environment {
    variables = {
      TABLE_NAME     = aws_dynamodb_table.page_views.name
      SNS_TOPIC_ARN  = aws_sns_topic.threshold_alert.arn
      VIEW_THRESHOLD = "1000"
      SECRET_KEY     = "oe7XZ2FvVVRpWkUMokTuEC3PuAKpy4u9"
    }
  }

}

resource "aws_lambda_function_url" "view_counter_url" {
  function_name = aws_lambda_function.view_counter.function_name
  authorization_type = "NONE"
}

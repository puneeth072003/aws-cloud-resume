resource "aws_cloudwatch_metric_alarm" "lambda_invocation_alarm" {
  alarm_name          = "Lambda80PercentUsage"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Invocations"
  namespace           = "AWS/Lambda"
  period              = 2678400   # 31 days in seconds
  statistic           = "Sum"
  threshold           = 800000    # 80% of 1M
  alarm_description   = "Lambda invocations > 800,000 this month"
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = aws_lambda_function.view_counter.function_name
  }

  alarm_actions = [aws_sns_topic.free_tier_alerts.arn]
}
resource "aws_cloudwatch_metric_alarm" "logs_ingestion_alarm" {
  alarm_name          = "Logs80PercentIngest"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "IncomingBytes"
  namespace           = "AWS/Logs"
  period              = 2678400
  statistic           = "Sum"
  threshold           = 4000000000  # 4 GB = 80% of 5GB
  alarm_description   = "Logs ingestion > 4 GB this month"
  treat_missing_data  = "notBreaching"

  alarm_actions = [aws_sns_topic.free_tier_alerts.arn]
}
resource "aws_cloudwatch_metric_alarm" "sns_publish_alarm" {
  alarm_name          = "SNS80PercentPublish"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "NumberOfMessagesPublished"
  namespace           = "AWS/SNS"
  period              = 2678400
  statistic           = "Sum"
  threshold           = 800000
  alarm_description   = "SNS publishes > 800,000"
  treat_missing_data  = "notBreaching"

  dimensions = {
    TopicName = aws_sns_topic.free_tier_alerts.name
  }

  alarm_actions = [aws_sns_topic.free_tier_alerts.arn]
}

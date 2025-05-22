resource "aws_cloudwatch_metric_alarm" "lambda_invocation_alarm" {
  alarm_name          = "Lambda80PercentUsage"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Invocations"
  namespace           = "AWS/Lambda"
  period              = 604800   # a week
  statistic           = "Sum"
  threshold           = 200000  # Approx 800k/month / 4 weeks
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
  period              = 604800 
  statistic           = "Sum"
  threshold           = 200000  # 4 GB = 80% of 5GB
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
  period              = 604800
  statistic           = "Sum"
  threshold           = 200000
  alarm_description   = "SNS publishes > 800,000"
  treat_missing_data  = "notBreaching"

  dimensions = {
    TopicName = aws_sns_topic.free_tier_alerts.name
  }

  alarm_actions = [aws_sns_topic.free_tier_alerts.arn]
}

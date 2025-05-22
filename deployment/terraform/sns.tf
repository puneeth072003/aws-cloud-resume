resource "aws_sns_topic" "threshold_alert" {
  name = "view-threshold-alert"
}

resource "aws_sns_topic" "free_tier_alerts" {
  name = "free-tier-alerts-topic"
}

resource "aws_sns_topic_subscription" "email_alert" {
  topic_arn = aws_sns_topic.threshold_alert.arn
  protocol  = "email"
  endpoint  = var.alert_email
}
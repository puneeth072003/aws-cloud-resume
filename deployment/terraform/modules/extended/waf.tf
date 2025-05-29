resource "aws_wafv2_web_acl" "cloudfront_acl" {
  name        = "cloudfront-web-acl"
  scope       = "CLOUDFRONT"
  description = "Protect CloudFront with AWS managed rules"

  default_action {
    allow {}
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "cloudfront-acl"
    sampled_requests_enabled   = true
  }

  rule {
    name     = "AWS-AWSManagedRulesCommonRuleSet"
    priority = 1

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "CommonRuleSet"
      sampled_requests_enabled   = true
    }
  }
}

resource "aws_wafv2_web_acl_association" "frontend_acl_assoc" {
  resource_arn = aws_cloudfront_distribution.frontend_cdn.arn
  web_acl_arn  = aws_wafv2_web_acl.cloudfront_acl.arn
}

output "bucket_regional_domain_name" {
  value = aws_s3_bucket.frontend_bucket.bucket_regional_domain_name
}
output "api_gateway_endpoint" {
  description = "Invoke URL for the API Gateway HTTP API"
  value       = aws_apigatewayv2_api.api.api_endpoint
}
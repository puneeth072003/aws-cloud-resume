output "lambda_url" {
  value = aws_lambda_function_url.view_counter_url.function_url
}
output "view_counter_function_name" {
  value = aws_lambda_function.view_counter.function_name
}
output "view_counter_function_arn" {
  value = aws_lambda_function.view_counter.arn
}
variable "frontend_bucket_name" {
  description = "S3 bucket name for hosting frontend"
  type        = string
}

variable "frontend_files_path" {
  description = "Path to the frontend files to be uploaded to S3"
  type        = string
}


variable "view_counter_function_name" {
  description = "Name of the Lambda function from base stack"
  type        = string
}

variable "view_counter_function_arn" {
  description = "ARN of the Lambda function from base stack"
  type        = string
}
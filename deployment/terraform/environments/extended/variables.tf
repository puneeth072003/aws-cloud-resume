variable "frontend_bucket_name" {
  description = "S3 bucket name for hosting frontend"
  type        = string
}
variable "alert_email" {
  description = "Email to receive alerts when views cross the threshold"
  type        = string
}
variable "file_path" {
  description = "Path to the Lambda function zip file"
  type        = string
}

variable "frontend_files_path" {
  description = "Path to the frontend files to be uploaded to S3"
  type        = string
}
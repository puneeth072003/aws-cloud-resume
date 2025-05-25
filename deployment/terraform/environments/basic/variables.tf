variable "alert_email" {
  description = "Email to receive alerts when views cross the threshold"
  type        = string
}
variable "file_path" {
  description = "Path to the Lambda function zip file"
  type        = string
}
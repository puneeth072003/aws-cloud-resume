variable "frontend_bucket_name" {
  description = "S3 bucket name for hosting frontend"
  type        = string
}

variable "frontend_files_path" {
  description = "Path to the frontend files to be uploaded to S3"
  type        = string
}

variable "route53_zone_id" {
  description = "The ID of the Route 53 hosted zone"
  type        = string
}

variable "domain_name" {
  description = "The domain name to associate with the CloudFront distribution"
  type        = string
}
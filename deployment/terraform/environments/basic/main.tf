provider "aws" {
  region = "ap-south-1"
}

module "base_stack" {
  source      = "../../modules/base"
  alert_email = var.alert_email
  file_path   = var.file_path
}
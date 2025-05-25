provider "aws" {
  region = "ap-south-1"
}

module "base_stack" {
  source      = "../../modules/base"
  alert_email = var.alert_email
  frontend_bucket_name = var.frontend_bucket_name
}


module "extended_stack" {
  source = "../../modules/extended"
}

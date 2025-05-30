provider "aws" {
  region = "ap-south-1"
}

module "base_stack" {
  source      = "../../modules/base"
  alert_email = var.alert_email
  file_path   = var.file_path
}

module "extended_stack" {
  source                    = "../../modules/extended"
  frontend_bucket_name      = var.frontend_bucket_name
  frontend_files_path      = var.frontend_files_path
  view_counter_function_name = module.base_stack.view_counter_function_name
  view_counter_function_arn  = module.base_stack.view_counter_function_arn
}

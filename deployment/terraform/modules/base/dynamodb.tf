resource "aws_dynamodb_table" "page_views" {
  name           = "page_views"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "page"

  attribute {
    name = "page"
    type = "S"
  }
}

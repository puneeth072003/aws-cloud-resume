resource "aws_s3_bucket" "frontend_bucket" {
  bucket = var.frontend_bucket_name

  tags = {
    Name = "FrontendBucket"
  }
}

resource "aws_s3_bucket_public_access_block" "frontend_access_block" {
  bucket = aws_s3_bucket.frontend_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "frontend_policy" {
  bucket = aws_s3_bucket.frontend_bucket.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid       = "PublicReadGetObject",
        Effect    = "Allow",
        Principal = "*",
        Action    = "s3:GetObject",
        Resource  = "${aws_s3_bucket.frontend_bucket.arn}/*"
      }
    ]
  })
}

resource "aws_s3_bucket_website_configuration" "frontend_website" {
  bucket = aws_s3_bucket.frontend_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_object" "frontend_files" {
  for_each = fileset(var.frontend_files_path, "**/*.*")

  bucket = aws_s3_bucket.frontend_bucket.id
  key    = each.value
  source = "${var.frontend_files_path}/${each.value}"  # Full path to individual file
  etag   = filemd5("${var.frontend_files_path}/${each.value}")  # Calculate MD5 of individual file
  content_type = lookup(
    {
      "html" = "text/html"
      "css"  = "text/css"
      "js"   = "application/javascript"
      "png"  = "image/png"
      "jpg"  = "image/jpeg"
      "mp4"  = "video/mp4"
      "pdf"  = "application/pdf"
    },
    split(".", each.value)[length(split(".", each.value)) - 1],
    "application/octet-stream"
  )
}

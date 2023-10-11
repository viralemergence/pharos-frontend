aws cloudformation update-stack \
  --stack-name pharos-frontend-2 \
  --template-body file://build-stack.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1 \
  --profile verena-prod-developer # AWS profile name


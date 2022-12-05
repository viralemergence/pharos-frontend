aws cloudformation update-stack \
  --stack-name pharos-frontend \
  --template-body file://build-stack.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --tags Key=Project,Value=PHAROS \
         Key=Project:Detail,Value=PHAROS \


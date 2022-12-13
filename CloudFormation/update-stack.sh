aws cloudformation update-stack \
  --stack-name pharos-frontend \
  --template-body file://build-stack.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --tags Key=Project,Value=Pharos \
         Key=Project:Detail,Value=Pharos \


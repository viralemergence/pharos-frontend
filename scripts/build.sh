#!/bin/bash

reset=0;
clean=0;
api='http://localhost:3000'

# parse params
while [[ "$#" > 0 ]];
  do case $1 in
    -r|--reset) reset=1; shift;;
    -c|--clean) clean=1; shift;;
    -a|--api) api=$2; shift;;
    *) echo "Unknown parameter passed: $1"; exit 1 ;;
  esac
  shift
done

# # fetch environment variables from secrets manager
# export AIRTABLE_API_KEY=$(
#   aws secretsmanager get-secret-value --secret-id airtable-api-key --region us-west-1 |\
#   jq  -r .SecretString | jq -r .AIRTABLE_API_KEY\
# )
# export GATSBY_MAPBOX_API_KEY=$(
#   aws secretsmanager get-secret-value --secret-id pharos-mapbox-api-key --region us-west-1 |\
#   jq  -r .SecretString | jq -r .MAPBOX_API_KEY\
# )

echo 'Pull latest Pharos Documentation';
cd src/pharos-documentation;
git checkout publish;
git pull;
cd ../../;


if [ "$reset" == "1" ]; then 
  bvm upgrade;
  yarn install;
  gatsby clean;
fi

if [ "$clean" == "1" ]; then 
  gatsby clean
fi

export GATSBY_API_URL=$api

echo 'GATSBY_API_URL: '
echo $GATSBY_API_URL

gatsby build;




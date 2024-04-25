#!/bin/bash

reset=0;
clean=0;
api='http://localhost:3000'
mapping_api='http://localhost:5000'
profile=''

RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
LIME_YELLOW=$(tput setaf 190)
YELLOW=$(tput setaf 3)
POWDER_BLUE=$(tput setaf 153)
BLUE=$(tput setaf 4)
MAGENTA=$(tput setaf 5)
CYAN=$(tput setaf 6)
WHITE=$(tput setaf 7)
BRIGHT=$(tput bold)
NORMAL=$(tput sgr0)

# parse params
while [[ "$#" > 0 ]];
  do case $1 in
    -r|--reset) reset=1; shift;;
    -c|--clean) clean=1; shift;;
    -a|--api) api=$2; shift;;
    -a|--mapping_api) mapping_api=$2; shift;;
    -u|--user_pool_id) user_pool_id=$2; shift;;
    -c|--client_id) client_id=$2; shift;;
    -p|--profile) profile=$2; shift;;
    *) echo "Unknown parameter passed: $1"; exit 1 ;;
  esac
  shift
done

echo ""
if [ "$profile" != "" ]; then
  echo "AWS Profile: ${GREEN}${BRIGHT}$profile${NORMAL}"
else
  echo "${YELLOW}Not using AWS Profile${NORMAL}"
  echo ""
fi

echo "API_URL: ${YELLOW}$api${NORMAL}"
echo "MAPPING_API_URL: ${YELLOW}$mapping_api${NORMAL}"
echo ""

if [ "$user_pool_id" == "" ]; then
  echo "${RED}${BRIGHT}Cognito User Pool ID is Required ${NORMAL}"
else
  echo "${GREEN}${BRIGHT}Cognito User Pool ID is set${NORMAL}"
fi

if [ "$client_id" == "" ]; then
  echo "${RED}${BRIGHT}Cognito Client ID is Required ${NORMAL}"
else
  echo "${GREEN}${BRIGHT}Cognito Client ID is set${NORMAL}"
fi

echo ""

if [ "$client_id" == "" ] || [ "$user_pool_id" == "" ]; then
  exit 1
fi

# fetch environment variables from secrets manager

if [ "$profile" != "" ]; then
  airtable_key=$(
    aws secretsmanager get-secret-value --secret-id airtable-api-key --region us-east-1 --profile $profile|\
    jq  -r .SecretString | jq -r .AIRTABLE_API_KEY\
  )
else
  airtable_key=$(
    aws secretsmanager get-secret-value --secret-id airtable-api-key --region us-east-1 |\
    jq  -r .SecretString | jq -r .AIRTABLE_API_KEY\
  )
fi

if [ "$airtable_key" == "" ]; then
  echo "${RED}${BRIGHT}Airtable API key not found in secrets manager.${NORMAL}"
  echo ""
  exit 1
fi

export AIRTABLE_API_KEY=$airtable_key


if [ "$profile" != "" ]; then
  mapbox_key=$(
    aws secretsmanager get-secret-value --secret-id mapbox-api-key --region us-east-1 --profile $profile |\
    jq  -r .SecretString | jq -r .MAPBOX_API_KEY\
  )
else
  mapbox_key=$(
    aws secretsmanager get-secret-value --secret-id mapbox-api-key --region us-east-1 |\
    jq  -r .SecretString | jq -r .MAPBOX_API_KEY\
  )
fi

if [ "$mapbox_key" == "" ]; then
  echo "${RED}${BRIGHT}Mapbox API key not found in secrets manager.${NORMAL}"
  echo ""
  exit 1
fi

export GATSBY_MAPBOX_API_KEY=$mapbox_key


echo 'Pulling latest Pharos Documentation';
cd src/pharos-documentation;
# git checkout publish;
git pull origin/publish;
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
export GATSBY_MAPPING_API_URL=$mapping_api
export GATSBY_USER_POOL_ID=$user_pool_id
export GATSBY_CLIENT_ID=$client_id


gatsby build;





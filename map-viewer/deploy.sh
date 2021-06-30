####################################
########### VARIABLES ##############
####################################
GCP_PROJECT="secret"
SERVICE_NAME="natcap-viewer"
REGION="us-east1"

####################################
###### GENERATED VARIABLES #########
####################################
#npm_package_version=0.1.0
VERSION="$(npm run env | grep npm_package_version | sed 's/npm_package_version=//g' | sed 's/",//g' | sed 's/ //g')"
IMAGE_NAME="gcr.io/$GCP_PROJECT/$SERVICE_NAME"
IMAGE_NAME_VERSION="$IMAGE_NAME:$VERSION"
IMAGE_NAME_LATEST="$IMAGE_NAME:latest"
echo "Scraped version: $VERSION"
echo "Image Name version: $IMAGE_NAME_VERSION"

####################################
############# BUILD ################
####################################
echo "Create Docker image via 'Cloud Build' ..."
gcloud builds submit  \
  --tag "$IMAGE_NAME_VERSION" \
  --project $GCP_PROJECT

####################################
############ TAGGING ###############
####################################
echo "Add tags '$IMAGE_NAME_LATEST' and '$IMAGE_NAME_VERSION' to docker image..."
gcloud container images add-tag "$IMAGE_NAME_VERSION" $IMAGE_NAME_LATEST --quiet

####################################
########### DEPLOYMENT #############
####################################
echo "Deploying Cloud Run Service '$SERVICE_NAME' to '$GCP_PROJECT' in '$REGION' "
gcloud run deploy $SERVICE_NAME \
  --image "$IMAGE_NAME_VERSION" \
  --project $GCP_PROJECT \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated

# specifying python path here helps avoid gcloud "permission denied" errors.
export CLOUDSDK_PYTHON="C:\Program Files\Python38\python.exe"

####################################
########### VARIABLES ##############
####################################
GCP_PROJECT="secret"
PRODUCT_NAME="natcap-viewer"
REGION="us-east1"
# replace any forward slashes in branch name with dashes
GIT_BRANCH= echo "$(git branch --show-current)" | sed -r 's/\//-/g'
GIT_COMMIT="$(git rev-parse --short HEAD)"
SERVICE_NAME="$PRODUCT_NAME-$GIT_BRANCH-$GIT_COMMIT"
DOCKER_NAME="$PRODUCT_NAME-deploy"

####################################
###### GENERATED VARIABLES #########
####################################
#npm_package_version=0.1.0
VERSION="$(npm run env | grep npm_package_version | sed 's/npm_package_version=//g' | sed 's/",//g' | sed 's/ //g')"
IMAGE_NAME="gcr.io/$GCP_PROJECT/$DOCKER_NAME"
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
  --project $GCP_PROJECT \
  --timeout 1800

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
  --image "$IMAGE_NAME_LATEST" \
  --project $GCP_PROJECT \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated

####################################
########### VARIABLES ##############
####################################
GCP_PROJECT="secret"
SERVICE_NAME="natcap-viewer"
REGION="us-east1"

####################################
###### GENERATED VARIABLES #########
####################################
IMAGE_NAME="gcr.io/$GCP_PROJECT/$SERVICE_NAME"
IMAGE_NAME_LATEST="$IMAGE_NAME:latest"

####################################
########## CLEANUP GCR #############
####################################
gcloud container images delete "$IMAGE_NAME_LATEST" \
   --force-delete-tags \
   --quiet

####################################
####### CLEANUP Cloud RUn ##########
####################################
gcloud run services delete $SERVICE_NAME \
  --project $GCP_PROJECT \
  --platform managed \
  --region $REGION

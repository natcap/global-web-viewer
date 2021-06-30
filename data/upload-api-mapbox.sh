#!/bin/bash

#token=secret
token=$(cat mapbox-upload-curl-private-token.txt)

while getopts f:n:t:c: flag
do
    case "${flag}" in
        f) filename=${OPTARG};;
        n) name=${OPTARG};;
        t) tilesetname=${OPTARG};;
        c) credentialsfile=${OPTARG};;
    esac
done

echo "Filename: $filename";

# Retrieve temporary credentials to stage the upload file on Amazon S3.
credentials=$(cat $credentialsfile)
echo "Credentials from file: $credentials"
accesskeyid=$(echo $credentials | awk 'BEGIN { FS = "\""; RS="," }; { if ($2 == "accessKeyId") {print $4} }')
echo "AKI: $accesskeyid"
if [ -z "$accesskeyid" ]; then
    echo "Retrieving credentials"
    echo "--------------"
    credentials=$(curl -X POST "https://api.mapbox.com/uploads/v1/$user/credentials?access_token=$token")
    echo "Credentials: $credentials"
    $(echo "$credentials" >> $credentialsfile)
fi

credentialbasename=$(basename -- "$credentialsfile")
credentialdirname=$(dirname -- "$credentialsfile")
credentialbackuppath="${credentialdirname}/${tilesetname}_${credentialbasename}"
$(echo "$credentials" >> $credentialbackuppath)

accesskeyid=$(echo $credentials | awk 'BEGIN { FS = "\""; RS="," }; { if ($2 == "accessKeyId") {print $4} }')
echo "AKI: $accesskeyid"
bucket=$(echo $credentials | awk 'BEGIN { FS = "\""; RS="," }; { if ($2 == "bucket") {print $4} }')
echo "Bucket: $bucket"
key=$(echo $credentials | awk 'BEGIN { FS = "\""; RS="," }; { if ($2 == "key") {print $4} }')
echo "Key: $key"
secretaccesskey=$(echo $credentials | awk 'BEGIN { FS = "\""; RS="," }; { if ($2 == "secretAccessKey") {print $4} }')
echo "SAK: $secretaccesskey"
sessiontoken=$(echo $credentials | awk 'BEGIN { FS = "\""; RS="," }; { if ($2 == "sessionToken") {print $4} }')
echo "ST: $sessiontoken"
url=$(echo $credentials | awk 'BEGIN { FS = "\""; RS="," }; { if ($2 == "url") {print $4} }')
echo "URL: $url"

# Set environment variables that allow you to upload data to S3.
echo "Setting ENV variables"
echo "--------------"
export AWS_ACCESS_KEY_ID="$accesskeyid"
export AWS_SECRET_ACCESS_KEY="$secretaccesskey"
export AWS_SESSION_TOKEN="$sessiontoken"

echo "AWK_A_K_ID: $AWS_ACCESS_KEY_ID"

# Stage your data
echo "Staging data for upload"
echo "--------------"
echo "aws s3 cp $filename to s3://$bucket/$key --region us-east-1"
#$(aws s3 cp $filename s3://$bucket/$key --region us-east-1)
aws s3 cp $filename s3://$bucket/$key --region us-east-1

# Begin the upload process.
echo "Uploading data"
echo "--------------"
#echo "$(curl -X POST -H \"Content-Type: application/json\" -H \"Cache-Control: no-cache\" -d \'{ \"url\": \"http://$bucket.s3.amazonaws.com/$key\", \"tileset\": \"$user.$tilesetname\", \"name\": \"$name\" }\' \'https://api.mapbox.com/uploads/v1/$user?access_token=$token\')"
#upload=$(curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -d '{ "url": "http://$bucket.s3.amazonaws.com/$key", "tileset": "$user.$tilesetname", "name": "$name" }' 'https://api.mapbox.com/uploads/v1/$user?access_token=$token')
upload=$(curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -d "{ \"url\": \"http://$bucket.s3.amazonaws.com/$key\", \"tileset\": \"$user.$tilesetname\", \"name\": \"$name\" }" "https://api.mapbox.com/uploads/v1/$user?access_token=$token")
echo "Upload response:"
echo "$upload"
uploadid=$(echo $upload | awk 'BEGIN { FS = "\""; RS="," }; { if ($2 == "id") {print $4} }')
echo "Upload ID: $uploadid"
$(echo "upload id: $uploadid" > $credentialbackuppath)

error=$(echo $upload | awk 'BEGIN { FS = "\""; RS="," }; { if ($2 == "error") {print $4} }')
echo "Error: $error"

#while sleep 5; do
#    uploadprogress=$(curl "https://api.mapbox.com/uploads/v1/user/$uploadid?access_token=$token")
#    progress=$(echo $uploadprogress | awk 'BEGIN { FS = "\""; RS="," }; { if ($2 == "progress") {print $4} }')
#    echo "Upload progess: $progress"
#    if ($progress == "1"); then
#        break
#    fi
#done

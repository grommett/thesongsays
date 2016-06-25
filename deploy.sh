#!/bin/sh
if [ -z "$1" ]
  then
    echo "You need to specify a 'dev' or 'prd' deployment type"
    exit 1
fi


if [ $1 == "dev" ]
  then
    domain='dev.thesongsays.com'
    echo "Deploying to dev ..."
fi
if [ $1 == "prd" ]
  then
    domain='thesongsays.com'
    echo "Deploying to prd ..."
fi

builddir=./build/*
dirdate=$(date +%m-%d-%Y-%H-%M)
proddir="~/domains/$domain/$dirdate"
user=pinkiering.com
server=pinkiering.com

# Build and mins the prod files. See package.json
echo "Building site..."
rm -rf ./build
if [ $1 == "dev" ]
  then
    npm run build:dev
fi
if [ $1 == "prd" ]
  then
    npm run build:prod
fi


# Put build files on the server
echo "Deploying files to server..."
rsync --ignore-times -r -p --exclude '.DS_Store' $builddir $user@$server:$proddir

# Change sym link (HTML) to point to this new dir
# EOF Didn't work here.
# Had to wrap the remote commands in a string :/
echo "Recreating html sym link on server to point to $proddir ..."
ssh $user@$server "
cd ~/domains/$domain/
rm -rf html
ln -s $dirdate html
exit
"

# Clean up (delete) the build directory
echo 'Cleaning up...'
npm run clean:prod
echo "Done"

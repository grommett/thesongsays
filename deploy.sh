#!/bin/sh

builddir=./build/*
domain='dev.thesongsays.com'
dirdate=$(date +%m-%d-%Y-%H-%M)
proddir="~/domains/$domain/$dirdate"
user=pinkiering.com
server=pinkiering.com

# Build and mins the prod files. See package.json
echo "Building site..."
rm -rf ./build
npm run build:prod

# Put build files on the server
echo "Deploying files to server..."
rsync --ignore-times -r --exclude '.DS_Store' $builddir $user@$server:$proddir

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

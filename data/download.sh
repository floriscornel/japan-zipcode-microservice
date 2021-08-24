#!/bin/sh
cd "$(dirname "$0")"
CSVFILE="KEN_ALL.CSV"
ZIPFILE="ken_all.zip"

if [  ! -f $CSVFILE  ]; then
   echo "File $CSVFILE does not exist."
   echo "Downloading $ZIPFILE.."
   wget -q https://www.post.japanpost.jp/zipcode/dl/kogaki/zip/ken_all.zip -O $ZIPFILE
   unzip -qo $ZIPFILE
   rm $ZIPFILE
fi

if [  ! -f $CSVFILE ]; then
   echo "Error $CSVFILE does not exist after download."
   exit 255
else
    echo "$CSVFILE found!"
fi
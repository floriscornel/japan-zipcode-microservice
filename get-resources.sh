#!/bin/sh
wget -O resources/ken_all.zip https://www.post.japanpost.jp/zipcode/dl/kogaki/zip/ken_all.zip
unzip -d resources/ resources/ken_all.zip

wget -O resources/jigyosyo.zip https://www.post.japanpost.jp/zipcode/dl/jigyosyo/zip/jigyosyo.zip
unzip -d resources/ resources/jigyosyo.zip

wget -O resources/ken_all_rome.zip https://www.post.japanpost.jp/zipcode/dl/roman/ken_all_rome.zip
unzip -d resources/ resources/ken_all_rome.zip

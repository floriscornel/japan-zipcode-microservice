import { Address } from "../datatypes/address";

import fs = require("fs");
import parse = require("csv-parse");
import iconv = require("iconv-lite");

const zipcodes = loadCSV();

/**
 * This function reads a CSV file from disk into a Map
 */
function loadCSV(): Map<string, Address> {
  const zipcodes = new Map();

  const inputFile = "./data/KEN_ALL.CSV";
  console.time("Zipcode CSV file loaded");
  fs.createReadStream(inputFile)
    .pipe(iconv.decodeStream("SJIS"))
    .pipe(iconv.encodeStream("UTF-8"))
    .pipe(parse({ delimiter: "," }))
    .on("data", function (csvrow) {
      const key: string = csvrow[2];
      const address: Address = {
        zipcode: csvrow[2].slice(0, 3) + "-" + csvrow[2].slice(3),
        prefectureKana: csvrow[3],
        cityKana: csvrow[4],
        townKana: csvrow[5],
        prefectureKanji: csvrow[6],
        cityKanji: csvrow[7],
        townKanji: csvrow[8],
        govcode: csvrow[0],
      };
      zipcodes.set(key, address);
    })
    .on("end", () => {
      console.timeEnd("Zipcode CSV file loaded");
    });
  return zipcodes;
}

/**
 * This function looks up an Address by zipcode string.
 */
export function getAddress(zipcode: string): Address | null {
  zipcode = zipcode.replace("-", "");
  return zipcodes.get(zipcode) ?? null;
}

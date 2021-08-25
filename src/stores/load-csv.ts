import fs = require("fs");
import parse = require("csv-parse");
import iconv = require("iconv-lite");
import hepburn = require("hepburn");

import { Address, JpString, Office } from "../datatypes/address";
import { zipcodeStore } from "./zipcodes";

function readCSV(filename: string, onData: (row: string[]) => void, onFinish: () => void) {
  const timerStr = filename + " loaded";
  console.time(timerStr);
  fs.createReadStream(filename)
    .pipe(iconv.decodeStream("SJIS"))
    .pipe(iconv.encodeStream("UTF-8"))
    .pipe(parse({ delimiter: "," }))
    .on("data", function (row) {
      onData(row);
    })
    .on("end", () => {
      console.timeEnd(timerStr);
      onFinish();
    });
}

function parseKana(str: string): string {
  const removeAfterBrace = /[^（(]+/g;
  const found = str.match(removeAfterBrace);
  if (found?.length > 0) {
    str = found[0];
  }
  return str.replace("　", "").replace(" ", "").trim();
}

function parseRomaji(str: string): string {
  const removeAfterBrace = /[^（(]+/g;
  const found = str.match(removeAfterBrace);
  if (found?.length > 0) {
    str = found[0];
  }
  return str.trim();
}

function loadKenAll(store: zipcodeStore): void {
  const inputFile = "./data/KEN_ALL.CSV";
  readCSV(
    inputFile,
    (row) => {
      const prefecture: JpString = {
        kana: parseKana(row[3]),
        kanji: parseKana(row[6]),
        romaji: null,
      };
      const city: JpString = {
        kana: parseKana(row[4]),
        kanji: parseKana(row[7]),
        romaji: null,
      };
      const town: JpString = {
        kana: parseKana(row[5]),
        kanji: parseKana(row[8]),
        romaji: null,
      };
      const address: Address = {
        zipcode: row[2],
        prefecture,
        city,
        town,
        govcode: row[0],
        office: null,
      };

      store.prefectures.set(prefecture.kanji, prefecture);
      store.cities.set(city.kanji, city);
      store.towns.set(town.kanji, town);
      store.addresses.set(address.zipcode, address);
    },
    () => {
      loadJigoyoso(store);
    },
  );
}

function loadKenAllRome(store: zipcodeStore): void {
  const inputFile = "./data/KEN_ALL_ROME.CSV";
  readCSV(
    inputFile,
    (row) => {
      const prefecture: JpString = {
        kana: null,
        kanji: parseKana(row[1]),
        romaji: parseRomaji(row[4]),
      };
      const city: JpString = {
        kana: null,
        kanji: parseKana(row[2]),
        romaji: parseRomaji(row[5]),
      };
      const town: JpString = {
        kana: null,
        kanji: parseKana(row[3]),
        romaji: parseRomaji(row[6]),
      };

      if (prefecture.kanji !== "") {
        if (store.prefectures.get(prefecture.kanji)) {
          store.prefectures.get(prefecture.kanji).romaji = prefecture.romaji;
        } else {
          store.prefectures.set(prefecture.kanji, prefecture);
        }
      }

      if (city.kanji !== "") {
        if (store.cities.get(city.kanji)) {
          store.cities.get(city.kanji).romaji = city.romaji;
        } else {
          store.cities.set(city.kanji, city);
        }
      }

      if (town.kanji !== "") {
        if (store.towns.get(town.kanji)) {
          store.towns.get(town.kanji).romaji = town.romaji;
        } else {
          store.towns.set(town.kanji, town);
        }
      }
    },
    () => {
      syncData(store);
      checkData(store);
    },
  );
}

function loadJigoyoso(store: zipcodeStore): void {
  const inputFile = "./data/JIGYOSYO.CSV";
  readCSV(
    inputFile,
    (row) => {
      const zipcode = row[7];
      const prefecture: JpString = store.prefectures.get(row[3]) ?? {
        kanji: parseKana(row[3]),
        kana: null,
        romaji: null,
      };
      const city: JpString = store.cities.get(row[4]) ?? {
        kanji: parseKana(row[4]),
        kana: null,
        romaji: null,
      };
      const town: JpString = store.towns.get(row[5]) ?? {
        kanji: parseKana(row[5]),
        kana: null,
        romaji: null,
      };
      const office: Office = {
        name: {
          kanji: row[2],
          kana: row[1],
          romaji: hepburn.fromKana(row[1]),
        },
        street: row[6],
      };
      const address: Address = {
        zipcode,
        prefecture,
        city,
        town,
        office,
        govcode: row[0],
      };
      store.prefectures.set(prefecture.kanji, prefecture);
      store.cities.set(city.kanji, city);
      store.towns.set(town.kanji, town);
      store.addresses.set(address.zipcode, address);
    },
    () => {
      loadKenAllRome(store);
    },
  );
}

function syncData(store: zipcodeStore): void {
  const timerStr = "Database synced";
  console.time(timerStr);
  store.addresses.forEach((address: Address) => {
    address.prefecture = store.prefectures.get(address.prefecture.kanji);
    address.city = store.cities.get(address.city.kanji);
    address.town = store.towns.get(address.town.kanji);
  });
  console.timeEnd(timerStr);
}

function checkData(store: zipcodeStore): void {
  const timerStr = "Fixing Romaji";
  console.time(timerStr);
  let kanji = 0;
  let kana = 0;
  let romaji = 0;
  store.towns.forEach((town: JpString) => {
    if (town.kanji !== null) {
      kanji++;
    }
    if (town.kana !== null) {
      kana++;
    }
    if (town.romaji == null && town.kana !== null) {
      town.romaji = hepburn.fromKana(town.kana);
    }
    if (town.romaji !== null) {
      romaji++;
    }
  });
  console.timeEnd(timerStr);

  console.log("Zipcodes found %d", store.addresses.size);
  console.log("Prefectures found %d", store.prefectures.size);
  console.log("Cities found %d", store.cities.size);
  console.log(
    "Towns found %d, kana %d (%f%), romaji %d (%f%)",
    kanji,
    kana,
    ((100 * kana) / kanji).toFixed(2),
    romaji,
    ((100 * romaji) / kanji).toFixed(2),
  );

  syncData(store);
}

export function loadCSVs(store: zipcodeStore): void {
  loadKenAll(store);
}

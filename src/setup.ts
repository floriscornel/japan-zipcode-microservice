const path = require("path");
const fs = require("fs");
const wget = require("wget-improved");
const AdmZip = require("adm-zip");

const dataDir = path.join(__dirname, "../data/");

const datasources = [
  {
    url: "https://www.post.japanpost.jp/zipcode/dl/kogaki/zip/ken_all.zip",
    zip: path.join(dataDir, "ken_all.zip"),
    csv: path.join(dataDir, "KEN_ALL.CSV"),
  },
  {
    url: "https://www.post.japanpost.jp/zipcode/dl/jigyosyo/zip/jigyosyo.zip",
    zip: path.join(dataDir, "jigyosyo.zip"),
    csv: path.join(dataDir, "JIGYOSYO.CSV"),
  },
  {
    url: "https://www.post.japanpost.jp/zipcode/dl/roman/ken_all_rome.zip?",
    zip: path.join(dataDir, "ken_all_rome.zip"),
    csv: path.join(dataDir, "KEN_ALL_ROME.CSV"),
  },
];

for (const source of datasources) {
  const download = wget.download(source.url, source.zip, {});
  download.on("error", function (err) {
    console.log(err);
    process.exit(1);
  });
  download.on("start", function (fileSize) {
    console.log(
      "Staring download of %s (%f MB)",
      source.zip,
      (fileSize / (1024 * 1024)).toFixed(2),
    );
  });
  download.on("end", function () {
    console.log("Finished downloading %s", source.zip);
    try {
      if (fs.existsSync(source.zip)) {
        const zip = new AdmZip(source.zip);
        zip.extractAllTo(dataDir, true);
        try {
          if (fs.existsSync(source.csv)) {
            fs.unlinkSync(source.zip);
            console.log("extracted " + source.csv);
          } else {
            fail(source.csv + " not found.");
          }
        } catch (err) {
          fail(err);
        }
      } else {
        fail(source.zip + " not found.");
      }
    } catch (err) {
      fail(err);
    }
  });
}

function fail(err) {
  console.error(err);
  process.exit(255);
}

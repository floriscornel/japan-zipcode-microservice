use encoding_rs;
use serde::{Deserialize, Serialize};
use std::fs;
use std::collections::HashMap;


#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Record {
    zipcode: i32,
    prefecture_kanji: String,
    city_kanji: String,
    town_kanji: String,
    prefecture_romaji: String,
    city_romaji: String,
    town_romaji: String,
}

pub fn read_csv_file() -> Result<HashMap<i32, Record>, csv::Error> {
    let s = fs::read("./resources/KEN_ALL_ROME.CSV").unwrap();
    let (res, _, _) = encoding_rs::SHIFT_JIS.decode(&s);
    let text = res.into_owned();

    let mut reader = csv::ReaderBuilder::new()
        .has_headers(false)
        .from_reader(text.as_bytes());

    let mut records: HashMap<i32, Record> = HashMap::new();

    for line in reader.deserialize() {
        let record: Record = line?;
        records.insert(record.zipcode, record);
    }
    Ok(records)
}

#[derive(Debug)]
pub struct JpString {
    pub kanji: String,
    pub kana: Option<String>,
    pub romaji: Option<String>,
}

#[derive(Debug)]
pub struct Address {
    pub zipcode: i32,
    pub prefecture: JpString,
    pub city: JpString,
    pub town: JpString,
    pub govcode: String,
}

mod resources;

#[macro_use] extern crate rocket;

use std::collections::HashMap;
use lazy_static::lazy_static;
use rocket::serde::{Serialize, json::Json};

lazy_static! {
    static ref ADDRESS_MAP: HashMap<i32, resources::ken_all_rome::Record> = resources::ken_all_rome::read_csv_file().unwrap();
}

#[get("/")]
fn index() -> &'static str {
    "try /zip/1040045"
}

#[derive(Serialize)]
struct Result<'a> {
    success: bool,
    address: Option<&'a resources::ken_all_rome::Record>
}

#[get("/zip/<zipcode>")]
fn address(zipcode: i32) -> Json<Result<'static>> {
    match ADDRESS_MAP.get(&zipcode) {
        Some(a) => Json(Result { success: true, address: Some(a) }),
        None => Json(Result { success: false, address: None })
    }
}

#[launch]
fn rocket() -> _ {
    let _setup = ADDRESS_MAP.get(&1040045);
    rocket::build()
    .mount("/", routes![index, address])
}
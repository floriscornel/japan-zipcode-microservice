mod resources;

use actix_web::{get, web, App, HttpResponse, HttpServer, Responder, Result};
use lazy_static::lazy_static;
use std::collections::HashMap;

lazy_static! {
    static ref ADDRESS_MAP: HashMap<i32, resources::ken_all_rome::Record> =
        resources::ken_all_rome::read_csv_file().unwrap();
}

#[get("/")]
async fn index() -> impl Responder {
    HttpResponse::Ok().body("Example usage: /zip/1110053 ")
}

#[get("/zip/{code}")]
async fn zipcode(code: web::Path<i32>) -> Result<impl Responder> {
    let obj = ADDRESS_MAP.get(&code.into_inner()).unwrap();
    Ok(web::Json(obj))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize the lazy static by using it.
    let _obj = ADDRESS_MAP.get(&1040045).unwrap();

    HttpServer::new(|| App::new().service(index).service(zipcode))
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}

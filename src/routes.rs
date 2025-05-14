use askama::Template;
use axum::{
    response::IntoResponse,
    routing::get,
    Router,
};
use tower_http::services::ServeDir;

use crate::HtmlTemplate;

pub fn setup_router() -> Router {
    let curr_dir = std::env::current_dir().unwrap();
    let router = Router::new()
        .route("/", get(home))
        .nest_service(
            "/public",
            ServeDir::new(format!("{}/public", curr_dir.to_str().unwrap())),
        );

    router
}

// Common structs

struct CommonPageContext {
    title: String,
    page_title: String,
    page_description: String,
}

// Home page

async fn home() -> impl IntoResponse {
    let template = HomeTemplate {
        title: "Blood Destiny".to_string(),
        route: "/".to_string(),
    };
    HtmlTemplate(template)
}

#[derive(Template)]
#[template(path = "pages/home.html")]
struct HomeTemplate {
    title: String,
    route: String,
}
mod routes;
mod templates;

use tracing::info;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use routes::setup_router;
use templates::HtmlTemplate;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "blood_destiny_site_v2=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    info!("initializing router...");

    let router = setup_router();

    // We could also read our port in from the environment as well
    let port = 8000_u16;
    let addr = std::net::SocketAddr::from(([0, 0, 0, 0], port));
    info!("router initialized, now listening on port {}", port);

    let listener = tokio::net::TcpListener::bind(addr)
        .await?;
    axum::serve(listener, router.into_make_service())
        .await?;

    Ok(())
}

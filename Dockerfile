FROM rust as builder

WORKDIR /app
RUN cargo init
COPY Cargo.lock .
COPY Cargo.toml .
RUN mkdir .cargo
RUN cargo vendor > .cargo/config
RUN cargo build

COPY ./src /app/src
RUN cargo build --release
# RUN cargo install --path . --verbose

FROM debian:buster-slim
WORKDIR /app
COPY --from=builder /app/target/release/japan-zipcode-microservice /app/japan-zipcode-microservice
COPY ./resources/KEN_ALL_ROME.CSV /app/resources/KEN_ALL_ROME.CSV
ENV PATH=$PATH:/app
RUN chmod 755 /app/japan-zipcode-microservice
CMD ["/app/japan-zipcode-microservice"]
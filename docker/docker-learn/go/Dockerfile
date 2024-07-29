ARG GO_VERSION=1.22-alpine
ARG APP_VERSION=1.0
ARG APP_PORT=8080

# Build stage
FROM golang:${GO_VERSION} as build

WORKDIR /src

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o /bin/main .


# Production stage
FROM alpine

COPY --from=build /bin/ /bin/

EXPOSE ${APP_PORT}

# RUN addgroup -S appgroup && adduser -S appuser
# RUN chown -R appuser:appgroup /bin
# USER appuser

CMD [ "/bin/main" ]
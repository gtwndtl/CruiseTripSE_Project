FROM golang:1.22-alpine
WORKDIR /go/src/team03/se67
COPY backend .
RUN apk add build-base
RUN go mod tidy
RUN go build -o main .
EXPOSE 8000
CMD ["./main"]
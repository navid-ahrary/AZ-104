package main

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"
)

type Response struct {
	Message string `json:"message"`
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	log.Info("Received request for /hello")
	resp := Response{Message: "Hello Docker"}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func main() {
	log.Info("Starting server on :8080")
	r := mux.NewRouter()
	r.HandleFunc("/hello", helloHandler).Methods("GET")
	http.ListenAndServe(":8080", nil)
}

package handlers

import (
	"log"
	"net/http"

	"real-time-forum/internal/services"

	"github.com/gorilla/websocket"
)

type MessageHandler struct {
	MessageService *services.MessageService
	upgrader       websocket.Upgrader
}

func (m *MessageHandler) MessageReciever(w http.ResponseWriter, r *http.Request) {
	m.upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
			// return r.Host == "localhost:8080"
		},
	}

	connection, err := m.upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Upgrading error: %#v\n", err)
		return
	}
	log.Println("Client connected.")

	defer connection.Close()

	for {
		mt, message, err := connection.ReadMessage()
		if err != nil {
			log.Printf("Reading error: %#v\n", err)
			break
		}
		log.Printf("recv: message %q", message)
		if err := connection.WriteMessage(mt, message); err != nil {
			log.Printf("Writing error: %#v\n", err)
			break
		}
	}
}

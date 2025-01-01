package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"

	"real-time-forum/internal/models"
	"real-time-forum/internal/services"

	"github.com/gofrs/uuid/v5"
	"github.com/gorilla/websocket"
)

type MessageHandler struct {
	MessageService *services.MessageService
	AuthService    *services.AuthService
	SessionService *services.SessionService
	Upgrader       websocket.Upgrader
	Clients        map[string]*websocket.Conn // Map to store connected clients (key: userID)
	ClientsMu      sync.Mutex                 // Mutex to safely access the clients map
}

func (m *MessageHandler) MessageReceiver(w http.ResponseWriter, r *http.Request) {
	fmt.Print("go")
	connection, err := m.Upgrader.Upgrade(w, r, nil)
	if err != nil {

		log.Printf("Upgrading error: %#v\n", err)
		return
	}
	sessionId, err := r.Cookie("sessionId")

	if err != nil || sessionId.Value == "" {
		log.Printf("session error: %#v\n", err)
		return
	}
	errSessions := m.SessionService.CheckSession(sessionId.Value)
	if errSessions != nil {
		log.Printf("session doesn't exist: %#v\n", err)
		return
	}

	user, err := m.AuthService.GetUserBySessionID(sessionId.Value)
	userID := user.ID
	if err == nil && userID != uuid.Nil {
		m.ClientsMu.Lock()
		m.Clients[userID.String()] = connection
		m.ClientsMu.Unlock()
		log.Printf("Client connected. %#v", userID.String())
	}else{
		log.Printf("user error: %#v\n", err)
		return
	}

	defer connection.Close()


	for {
		_, message, err := connection.ReadMessage()
		if err != nil {
			log.Printf("Reading error: %#v\n", err)
			break
		}

		var chat models.Chat
		err = json.Unmarshal(message, &chat)
		if err != nil {
			log.Printf("Unmarshal error: %#v\n", err)
			continue
		}
		if len(strings.TrimSpace(chat.Message)) == 0 {
			log.Println("Empty message received")
			continue
		}

		err = m.MessageService.Create(chat)
		if err != nil {
			log.Printf("Failed to create message: %#v\n", err)
			continue
		}
		fmt.Println(m.Clients)
		m.ClientsMu.Lock()
		receiverConn, exists := m.Clients[chat.Reciver]
		fmt.Println(exists)
		m.ClientsMu.Unlock()

		if exists {
			err = receiverConn.WriteMessage(websocket.TextMessage, []byte(chat.Message))
			if err != nil {
				log.Printf("Failed to send message to receiver: %#v\n", err)
			}
		} else {
			log.Printf("Receiver %s not found\n", chat.Reciver)
		}
	}

	m.ClientsMu.Lock()
	delete(m.Clients, userID.String())
	m.ClientsMu.Unlock()
	log.Printf("User %s disconnected\n", userID)
}

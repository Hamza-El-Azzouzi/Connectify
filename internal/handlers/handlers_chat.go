package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"sync"

	"real-time-forum/internal/models"
	"real-time-forum/internal/services"

	"github.com/gofrs/uuid/v5"
	"github.com/gorilla/websocket"
)

type ChatHandler struct {
	ChatService    *services.ChatService
	AuthService    *services.AuthService
	SessionService *services.SessionService
	Upgrader       websocket.Upgrader
	Clients        map[string]*websocket.Conn
	ClientsMu      sync.Mutex
}

func (m *ChatHandler) HandleConnection(w http.ResponseWriter, r *http.Request) {
	conn, err := m.Upgrader.Upgrade(w, r, nil)
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
		m.Clients[userID.String()] = conn
		m.ClientsMu.Unlock()
		log.Printf("Client connected. %#v", userID.String())
	} else {
		log.Printf("user error: %#v\n", err)
		return
	}

	defer conn.Close()

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Printf("Reading error: %#v\n", err)
			break
		}
		messageS := models.Message{}
		err = json.Unmarshal(message, &messageS)
		if err != nil {
			log.Printf("Reading error: %#v\n", err)
			break
		}

		if len(strings.TrimSpace(messageS.Content)) == 0 {
			log.Println("empty")
			return
		}
		errCreate := m.ChatService.Create(messageS)
		if errCreate != nil {
			log.Println(errCreate)
			return
		}
		m.ClientsMu.Lock()
		receiverConn, exists := m.Clients[messageS.ReceiverID]
		m.ClientsMu.Unlock()

		if exists {
			err = receiverConn.WriteMessage(websocket.TextMessage, []byte(messageS.Content))
			if err != nil {
				log.Printf("Failed to send message to receiver: %#v\n", err)
			}
		} else {
			log.Printf("Receiver %s not found\n", messageS.ReceiverID)
		}
	}
}

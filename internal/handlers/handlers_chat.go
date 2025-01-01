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

type ChatHandler struct {
	ChatService    *services.ChatService
	AuthService    *services.AuthService
	SessionService *services.SessionService
	Upgrader       websocket.Upgrader
	Clients        map[string]*websocket.Conn
	ClientsMu      sync.Mutex
}

func (c *ChatHandler) GetMessages(w http.ResponseWriter, r *http.Request) {
	chat := models.Chat{}
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&chat)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
	}
	defer r.Body.Close()
	messages, err := c.ChatService.GetMessages(chat.SnederID, chat.ReceiverID, chat.Offset)
	if err != nil {
		fmt.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(messages)
}

func (c *ChatHandler) HandleConnection(w http.ResponseWriter, r *http.Request) {
	conn, err := c.Upgrader.Upgrade(w, r, nil)
	if err != nil {

		log.Printf("Upgrading error: %#v\n", err)
		return
	}
	sessionId, err := r.Cookie("sessionId")

	if err != nil || sessionId.Value == "" {
		log.Printf("session error: %#v\n", err)
		return
	}
	errSessions := c.SessionService.CheckSession(sessionId.Value)
	if errSessions != nil {
		log.Printf("session doesn't exist: %#v\n", err)
		return
	}

	user, err := c.AuthService.GetUserBySessionID(sessionId.Value)
	userID := user.ID
	if err == nil && userID != uuid.Nil {
		c.ClientsMu.Lock()
		c.Clients[userID.String()] = conn
		c.ClientsMu.Unlock()
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
		errCreate := c.ChatService.Create(messageS)
		if errCreate != nil {
			log.Println(errCreate)
			return
		}
		c.ClientsMu.Lock()
		receiverConn, exists := c.Clients[messageS.ReceiverID]
		c.ClientsMu.Unlock()

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

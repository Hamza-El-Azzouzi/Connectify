package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"

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
	Clients        map[string]*models.Client
	ClientsMu      sync.Mutex
}


func (m *MessageHandler) MessageReceiver(w http.ResponseWriter, r *http.Request) {
	connection, err := m.Upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Upgrading error: %#v\n", err)
		return
	}

	sessionId, err := r.Cookie("sessionId")
	if err != nil {
		log.Printf("session error: %v\n", err)
		return
	}
	if sessionId.Value == "" {
		log.Printf("session empty: %#v\n", err)
		return
	}

	errSessions := m.SessionService.CheckSession(sessionId.Value)
	if errSessions != nil {
		log.Printf("session doesn't exist: %#v\n", err)
		return
	}

	user, err := m.AuthService.GetUserBySessionID(sessionId.Value)
	if err != nil || user.ID == uuid.Nil {
		log.Printf("user error: %#v\n", err)
		return
	}

	userID := user.ID.String()
	m.ClientsMu.Lock()
	m.Clients[userID] = &models.Client{
		Conn:     connection,
		LastPing: time.Now(),
	}
	m.ClientsMu.Unlock()
	log.Printf("Client connected: %s\n", userID)

	m.broadcastUserStatus(userID, true)

	// go m.checkInactiveClients()

	defer connection.Close()

	for {
		_, message, err := connection.ReadMessage()
		if err != nil {
			log.Printf("Reading error: %#v\n", err)
			break
		}

		var data map[string]string
		err = json.Unmarshal(message, &data)
		if err != nil {
			log.Printf("Unmarshal error: %#v\n", err)
			continue
		}

		if data["type"] == "ping" {
			m.ClientsMu.Lock()
			m.Clients[userID].LastPing = time.Now()
			m.ClientsMu.Unlock()

			err = connection.WriteJSON(map[string]string{
				"type": "pong",
			})
			if err != nil {
				log.Printf("Failed to send pong: %#v\n", err)
			}
			continue
		}

		if _, ok := data["msg"]; ok {
			var chat models.Chat
			err = json.Unmarshal(message, &chat)
			if err != nil {
				log.Printf("Unmarshal error: %#v\n", err)
				break
			}

			if len(strings.TrimSpace(chat.Message)) == 0 {
				log.Println("Empty message received")
				break
			}
			err = m.MessageService.Create(data["msg"], data["session"], data["id"])
			if err != nil {
				log.Printf("Failed to create message: %#v\n", err)
				break
			}
			m.ClientsMu.Lock()
			receiverClient, exists := m.Clients[chat.Reciver]
			m.ClientsMu.Unlock()

			if exists {
				err = receiverClient.Conn.WriteJSON(chat)
				if err != nil {
					log.Printf("Failed to send message to receiver: %#v\n", err)
				}
			} else {
				log.Printf("Receiver %s not found\n", chat.Reciver)
			}
		}
	}

	
	m.DisconnectClient(userID)
	
}

func (m *MessageHandler) DisconnectClient(userID string){
	m.ClientsMu.Lock()
	delete(m.Clients, userID)
	m.ClientsMu.Unlock()
	m.broadcastUserStatus(userID, false)
	log.Printf("User %s disconnected\n", userID)
}
func (m *MessageHandler) broadcastUserStatus(userID string, isOnline bool) {

	m.ClientsMu.Lock()
	defer m.ClientsMu.Unlock()

	for _, client := range m.Clients {
		fmt.Println("Yup")
		err := client.Conn.WriteJSON(map[string]any{
			"type":   "userStatus",
			"userID": userID,
			"online": isOnline,
		})
		if err != nil {
			log.Printf("Failed to broadcast user status: %#v\n", err)
		}
	}
}

func (m *MessageHandler) GetOnlineUsers(w http.ResponseWriter, r *http.Request) {
	m.ClientsMu.Lock()
	defer m.ClientsMu.Unlock()

	onlineUsers := []string{}
	for userID := range m.Clients {
		onlineUsers = append(onlineUsers, userID)
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(onlineUsers); err != nil {
		log.Printf("Error encoding online users: %#v\n", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}
}

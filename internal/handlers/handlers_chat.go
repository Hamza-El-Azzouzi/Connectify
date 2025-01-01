package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"real-time-forum/internal/models"
	"real-time-forum/internal/services"

	"github.com/gorilla/websocket"
)

type ChatHandler struct {
	ChatService *services.ChatService
	Hub         *models.Hub
	Upgarder    websocket.Upgrader
}

func (c *ChatHandler) NewHub() {
	c.Hub = &models.Hub{
		Chats: make(map[string]*models.Chat),
	}
}

func (c *ChatHandler) HandleConnection(w http.ResponseWriter, r *http.Request) {
	c.Upgarder = websocket.Upgrader{}
	conn, err := c.Upgarder.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("connected")
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
		fmt.Println(messageS)
	}
}

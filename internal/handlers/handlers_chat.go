package handlers

import (
	"fmt"
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
		
	}
}

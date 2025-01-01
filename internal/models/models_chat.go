package models

import (
	"github.com/gofrs/uuid/v5"
	"github.com/gorilla/websocket"
)

type Chat struct {
	ChatId  uuid.UUID
	Messages chan *Message
}

type Message struct {
	SnederID   string `json:"senderID"`
	ReceiverID string `json:"receiverID"`
	Content    string `json:"content"`
}

type Hub struct {
	Chats map[*websocket.Conn]*Chat
}

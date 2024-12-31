package models

import (
	"time"

	"github.com/gofrs/uuid/v5"
	"github.com/gorilla/websocket"
)

type Chat struct {
	ChatId  uuid.UUID
	Conn    *websocket.Conn
	Message chan *Message
}

type Message struct {
	SnederID   uuid.UUID
	ReceiverID uuid.UUID
	TimeStamp  time.Time
	Content    string
}

type Hub struct {
	Chats map[string]*Chat
}

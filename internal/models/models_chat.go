package models

import (
	"time"

	"github.com/gofrs/uuid/v5"
)

type MessageWithTime struct {
	MessageID     uuid.UUID
	SenderID      uuid.UUID
	ReceiverID    uuid.UUID
	Content       string
	CreatedAt     time.Time
	FormattedDate string
}

type Message struct {
	SenderID   string `json:"senderID"`
	ReceiverID string `json:"receiverID"`
	Content    string `json:"content"`
}

type Chat struct {
	SnederID   string `json:"senderID"`
	ReceiverID string `json:"receiverID"`
	Offset     int    `json:"offset"`
}

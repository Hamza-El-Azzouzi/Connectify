package services

import (
	"real-time-forum/internal/models"
	"real-time-forum/internal/repositories"

	"github.com/gofrs/uuid/v5"
)

type MessageService struct {
	MessageRepo *repositories.MessageRepository
	UserRepo *repositories.UserRepository
}

func (m *MessageService) Create(chat models.Chat) error {
	user, err := m.UserRepo.GetUserBySessionID(chat.Sender)
	if err != nil {
		return err
	}
	messageId := uuid.Must(uuid.NewV4())

	return m.MessageRepo.Create(messageId, chat, user.ID)
}

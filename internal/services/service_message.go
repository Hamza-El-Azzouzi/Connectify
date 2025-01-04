package services

import (
	"fmt"

	"real-time-forum/internal/models"
	"real-time-forum/internal/repositories"

	"github.com/gofrs/uuid/v5"
)

type MessageService struct {
	MessageRepo *repositories.MessageRepository
	UserRepo    *repositories.UserRepository
}

func (m *MessageService) Create(msg, session, id string) error {
	user, err := m.UserRepo.GetUserBySessionID(session)
	if err != nil {
		return err
	}
	messageId := uuid.Must(uuid.NewV4())

	return m.MessageRepo.Create(messageId, msg,id, user.ID)
}

func (m *MessageService) GetMessages(senderID, receiverID string, pagination int) ([]models.MessageWithTime, error) {
	user, err := m.UserRepo.GetUserBySessionID(senderID)
	if err != nil {
		return nil, err
	}

	messages, err := m.MessageRepo.GetMessages(user.ID.String(), receiverID, pagination)
	if err != nil {
		return nil, fmt.Errorf("error Kayn f All messages service : %v", err)
	}
	return messages, nil
}

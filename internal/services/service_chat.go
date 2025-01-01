package services

import (
	"fmt"

	"real-time-forum/internal/models"
	"real-time-forum/internal/repositories"

	"github.com/gofrs/uuid/v5"
)

type ChatService struct {
	ChatRepo *repositories.ChatRepository
	UserRepo *repositories.UserRepository
}

func (c *ChatService) Create(message models.Message) error {
	user, err := c.UserRepo.GetUserBySessionID(message.SenderID)
	if err != nil {
		return err
	}
	messageId := uuid.Must(uuid.NewV4())

	return c.ChatRepo.Create(messageId, message, user.ID)
}

func (c *ChatService) GetMessages(senderID, receiverID string, pagination int) ([]models.MessageWithTime, error) {
	user, err := c.UserRepo.GetUserBySessionID(senderID)
	if err != nil {
		return nil, err
	}

	messages, err := c.ChatRepo.GetMessages(user.ID.String(), receiverID, pagination)
	if err != nil {
		return nil, fmt.Errorf("error Kayn f All messages service : %v", err)
	}
	return messages, nil
}

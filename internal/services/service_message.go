package services

import (
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

	return m.MessageRepo.Create(messageId, msg, session, user.ID)
}

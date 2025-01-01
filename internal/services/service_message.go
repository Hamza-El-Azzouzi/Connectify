package services

import (
	"real-time-forum/internal/repositories"
)

type MessageService struct {
	MessageRepo *repositories.MessageRepository
}

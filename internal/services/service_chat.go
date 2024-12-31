package services

import "real-time-forum/internal/repositories"

type ChatService struct {
	ChatRepo *repositories.ChatRepository
}

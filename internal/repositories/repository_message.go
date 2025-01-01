package repositories

import (
	"database/sql"

	"real-time-forum/internal/models"

	"github.com/gofrs/uuid/v5"
)

type MessageRepository struct {
	DB *sql.DB
}

func (m *MessageRepository) Create(messageId uuid.UUID, chat models.Chat, sender uuid.UUID) error {
	Query := "INSERT INTO messages (id,user_id_sender,user_id_receiver,message)VALUES (?,?,?,?)"
	preparedQuery, err := m.DB.Prepare(Query)
	if err != nil {
		return err
	}
	_, err = preparedQuery.Exec(messageId, sender, chat.Reciver, chat.Message)
	return err
}

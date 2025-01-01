package repositories

import (
	"database/sql"

	"real-time-forum/internal/models"

	"github.com/gofrs/uuid/v5"
)

type ChatRepository struct {
	DB *sql.DB
}

func (c *ChatRepository) Create(messageId uuid.UUID, message models.Message, sender uuid.UUID) error {
	Query := "INSERT INTO messages (id,user_id_sender,user_id_receiver,message)VALUES (?,?,?,?)"
	preparedQuery, err := c.DB.Prepare(Query)
	if err != nil {
		return err
	}
	_, err = preparedQuery.Exec(messageId, message.SnederID, message.ReceiverID, message.Content)
	return err
}

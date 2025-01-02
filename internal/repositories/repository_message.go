package repositories

import (
	"database/sql"

	"github.com/gofrs/uuid/v5"
)

type MessageRepository struct {
	DB *sql.DB
}

// Create(messageId, msg, reciever_id,user.ID)
func (m *MessageRepository) Create(messageId uuid.UUID, msg string, reciever_id string, sender uuid.UUID) error {
	Query := "INSERT INTO messages (id,user_id_sender,user_id_receiver,message)VALUES (?,?,?,?)"
	preparedQuery, err := m.DB.Prepare(Query)
	if err != nil {
		return err
	}
	_, err = preparedQuery.Exec(messageId, sender, reciever_id, msg)
	return err
}

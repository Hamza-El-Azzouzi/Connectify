package repositories

import (
	"database/sql"

	"real-time-forum/internal/models"

	"github.com/gofrs/uuid/v5"
)

type MessageRepository struct {
	DB *sql.DB
}

// Create(messageId, msg, reciever_id,user.ID)
func (m *MessageRepository) Create(messageId uuid.UUID, msg string, reciever_id string, sender uuid.UUID, date string) error {
	Query := "INSERT INTO messages (id,user_id_sender,user_id_receiver,message,created_at)VALUES (?,?,?,?,?)"
	preparedQuery, err := m.DB.Prepare(Query)
	if err != nil {
		return err
	}
	_, err = preparedQuery.Exec(messageId, sender, reciever_id, msg, date)
	return err
}

func (m *MessageRepository) GetMessages(senderID, receiverID string, offset int) ([]models.MessageWithTime, error) {
	querySelect := `
	SELECT *
	FROM messages
	WHERE (user_id_sender = ? AND user_id_receiver = ?)
		OR (user_id_sender = ? AND user_id_receiver = ?)
	ORDER BY created_at DESC
	LIMIT 10 OFFSET ?;
	`
	rows, queryErr := m.DB.Query(querySelect, senderID, receiverID, receiverID, senderID, offset)
	if queryErr != nil {
		return nil, queryErr
	}
	defer rows.Close()
	var messages []models.MessageWithTime
	for rows.Next() {
		var currentMessage models.MessageWithTime
		scanErr := rows.Scan(
			&currentMessage.MessageID,
			&currentMessage.SenderID,
			&currentMessage.ReceiverID,
			&currentMessage.Content,
			&currentMessage.CreatedAt,
		)
		if scanErr != nil {
			return nil, scanErr
		}
		currentMessage.FormattedDate = currentMessage.CreatedAt.Format("2006-01-02 15:04")
		messages = append(messages, currentMessage)
	}
	return messages, nil
}

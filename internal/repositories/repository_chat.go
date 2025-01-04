package repositories

import (
	"database/sql"
	"time"

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
	_, err = preparedQuery.Exec(messageId, sender, message.ReceiverID, message.Content)
	return err
}

func (c *ChatRepository) GetMessages(senderID, receiverID string, offset int) ([]models.MessageWithTime, error) {
	querySelect := `
	SELECT *
	FROM messages
	WHERE (user_id_sender = ? AND user_id_receiver = ?)
		OR (user_id_sender = ? AND user_id_receiver = ?)
	ORDER BY created_at DESC
	LIMIT 10 OFFSET ?;
	`
	rows, queryErr := c.DB.Query(querySelect, senderID, receiverID, receiverID, senderID, offset)
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
		now := time.Now()
		if currentMessage.CreatedAt.Year() == now.Year() && currentMessage.CreatedAt.Month() == now.Month() && currentMessage.CreatedAt.Day() == now.Day() {
			currentMessage.FormattedDate = currentMessage.CreatedAt.Format("15:04")
		} else {
			currentMessage.FormattedDate = currentMessage.CreatedAt.Format("2006-01-02 15:04")
		}
		messages = append(messages, currentMessage)
	}
	return messages, nil
}

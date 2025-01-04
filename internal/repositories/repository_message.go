package repositories

import (
	"database/sql"
	"time"

	"real-time-forum/internal/models"

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

func (m *MessageRepository) GetMessages(senderID, receiverID string, offset int) ([]models.MessageWithTime, error) {
	querySelect := `
	SELECT *
	FROM messages
	WHERE (user_id_sender = ? AND user_id_receiver = ?) OR (user_id_sender = ? AND user_id_receiver = ?)
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
			&currentMessage.Unreaded,
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

func (m *MessageRepository) CheckUnReadMsg(userID string) ([]string, error) {
	querySelect := `
	SELECT DISTINCT user_id_sender 
	FROM messages
	WHERE user_id_receiver = ?  AND un_readed == 0;`
	rows, queryErr := m.DB.Query(querySelect, userID)
	if queryErr != nil {
		return nil, queryErr
	}
	defer rows.Close()
	usersID := []string{}
	for rows.Next() {
		var userId string
		scanErr := rows.Scan(&userId)
		if scanErr != nil {
			return nil, scanErr
		}
		usersID = append(usersID, userId)
	}
	return usersID, nil
}

func (m *MessageRepository) MarkReadMsg(sender string, receiver uuid.UUID) error {
	queryUpdate := ` UPDATE messages SET un_readed = 1 WHERE user_id_sender = ? AND user_id_receiver = ?;`
	preparedQuery, err := m.DB.Prepare(queryUpdate)
	if err != nil {
		return err
	}
	_, queryErr := preparedQuery.Exec(sender, receiver)
	if queryErr != nil {
		return queryErr
	}

	return nil
}

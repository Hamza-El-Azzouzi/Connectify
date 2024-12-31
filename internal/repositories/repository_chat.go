package repositories

import "database/sql"

type ChatRepository struct {
	DB *sql.DB
}

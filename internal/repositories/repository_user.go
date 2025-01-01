package repositories

import (
	"database/sql"

	"real-time-forum/internal/models"

	"github.com/gofrs/uuid/v5"
)

type UserRepository struct {
	DB *sql.DB
}

func (r *UserRepository) Create(user *models.User) error {
	preparedQuery, err := r.DB.Prepare(`INSERT INTO users (id, username,age,gender,first_name,last_name, email, password_hash) VALUES (?, ?,?,?,?,?, ?, ?)`)
	if err != nil {
		return err
	}
	_, err = preparedQuery.Exec(user.ID, user.Username, user.Age, user.Gender, user.FirstName, user.LastName, user.Email, user.PasswordHash)
	return err
}

func (repo *UserRepository) FindUser(identifier string, flag string) (*models.User, error) {
	user := &models.User{}
	query := ""
	switch true {
	case flag == "byId":
		query = `SELECT id, username, email, password_hash FROM users WHERE id= ?`
	case flag == "byEmail":
		query = `SELECT id, username, email, password_hash FROM users WHERE email= ?`
	case flag == "byUserName":
		query = `SELECT id, username, email, password_hash FROM users WHERE username= ?`
	}

	row := repo.DB.QueryRow(query, identifier)
	err := row.Scan(&user.ID, &user.Username, &user.Email, &user.PasswordHash)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return user, nil
}

func (r *UserRepository) GetUserBySessionID(sessionID string) (*models.User, error) {
	user := &models.User{}
	query := `SELECT users.id, users.username, users.email, users.password_hash
		FROM users 
		JOIN sessions ON users.id = sessions.user_id 
		WHERE sessions.session_id = ?`
	row := r.DB.QueryRow(query, sessionID)
	err := row.Scan(&user.ID, &user.Username, &user.Email, &user.PasswordHash)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return user, nil
}

func (r *UserRepository) GetUsers(userId uuid.UUID) ([]models.User, error) {
	allUser := []models.User{}
	query := `SELECT id, username , first_name, last_name FROM users where id != ? order by username ASC `
	rows , err := r.DB.Query(query,userId)
	if err != nil {
		if err == sql.ErrNoRows{
			return nil,nil
		}
		return nil ,err
	}
	for rows.Next(){
		user := models.User{}
		
		err := rows.Scan(&user.ID, &user.Username, &user.FirstName,&user.LastName)
		if err != nil {
			return nil, err
		}
		allUser = append(allUser , user)
	}
	return allUser , nil
}

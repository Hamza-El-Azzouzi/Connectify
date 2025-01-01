package handlers

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"real-time-forum/internal/middleware"
	"real-time-forum/internal/models"
	"real-time-forum/internal/services"
	"real-time-forum/internal/utils"

	"github.com/gofrs/uuid/v5"
)

type AuthHandler struct {
	AuthService    *services.AuthService
	AuthMidlaware  *middleware.AuthMiddleware
	SessionService *services.SessionService
}

func (h *AuthHandler) RegisterHandle(w http.ResponseWriter, r *http.Request) {
	ActiveUser, _ := h.AuthMidlaware.IsUserLoggedIn(w, r)

	if r.Method == http.MethodPost {
		if ActiveUser {
			sendResponse(w, "session")
			return
		}
		var info models.SignUpData
		err := json.NewDecoder(r.Body).Decode(&info)
		defer r.Body.Close()
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
		}
		if !h.AuthMidlaware.IsValidGender(info.Gender) ||
			!h.AuthMidlaware.IsValidAge(info.Age) ||
			!h.AuthMidlaware.IsValidEmail(info.Email) ||
			!h.AuthMidlaware.IsValidName(info.Username) ||
			!h.AuthMidlaware.IsValidPassword(info.Passwd) ||
			!h.AuthMidlaware.IsmatchPassword(info.Passwd, info.ConfirmPasswd) {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		err = h.AuthService.Register(info)
		if err != nil {
			switch true {
			case strings.Contains(err.Error(), "username"):
				sendResponse(w, "user")
				return
			case err.Error() == "email":
				sendResponse(w, "email")
				return
			default:
				sendResponse(w, "passwd")
			}
		}
		sendResponse(w, "Done")
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
}

func (h *AuthHandler) LoginHandle(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var info models.LoginData
		err := json.NewDecoder(r.Body).Decode(&info)
		defer r.Body.Close()
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		user, err := h.AuthService.Login(info.EmailOrUserName, info.Passwd)
		if err != nil || user == nil {
			switch true {
			case err.Error() == "in email or username":
				sendResponse(w, "Account Not found")
				return
			case strings.Contains(err.Error(), "password"):
				sendResponse(w, "passwd")
				return
			}
		}
		sessionExpires := time.Now().Add(5 * 60 * time.Minute)
		sessionId := uuid.Must(uuid.NewV4()).String()
		userSession := h.SessionService.CreateSession(sessionId, sessionExpires, user.ID)
		if userSession != nil {
			utils.Error(w, http.StatusInternalServerError)
			return
		}
		SetCookies(w, "sessionId", sessionId, sessionExpires)
		sendResponse(w, "Done")
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func sendResponse(w http.ResponseWriter, reply string) {
	w.Header().Set("Content-Type", "application/json")

	if reply != "Done" {
		w.WriteHeader(http.StatusBadRequest)
	}

	response := &models.LoginReply{
		REplyMssg: reply,
	}

	err := json.NewEncoder(w).Encode(&response)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func SetCookies(w http.ResponseWriter, name, value string, expires time.Time) {
	cookie := &http.Cookie{
		Name:     name,
		Value:    value,
		Path:     "/",
		Expires:  expires,
		HttpOnly: false,
	}

	http.SetCookie(w, cookie)
}

func (h *AuthHandler) LogoutHandle(w http.ResponseWriter, r *http.Request) {
	activeUser, _ := h.AuthMidlaware.IsUserLoggedIn(w, r)
	if !activeUser {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	sessionId, err := r.Cookie("sessionId")
	if err == nil || sessionId.Value != "" {
		err := h.SessionService.DeleteSession(sessionId.Value)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}

	SetCookies(w, "sessionId", "", time.Now().Add(-1*time.Hour))
	sendResponse(w, "Done")
}

func (h *AuthHandler) UserIntegrity(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		sessionId, err := r.Cookie("sessionId")
		if err == nil && sessionId.Value != "" {
			err := h.SessionService.CheckSession(sessionId.Value)
			if err != nil {
				sendResponse(w, "No User Found")
				return
			} else {
				sendResponse(w, "Done")
			}
		}
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func (h *AuthHandler) GetUsers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	sessionId, err := r.Cookie("sessionId")
	if err != nil || sessionId.Value == "" {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	errSessions := h.SessionService.CheckSession(sessionId.Value)
	if errSessions != nil {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	allUser, errUser := h.AuthService.GetUsers(sessionId.Value)
	if errUser != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(&allUser)
	if err != nil {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
}

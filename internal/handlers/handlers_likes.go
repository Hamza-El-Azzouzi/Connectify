package handlers

import (
	"net/http"
	"sync"

	"real-time-forum/internal/middleware"
	"real-time-forum/internal/services"
)

type ReactHandler struct {
	LikeService   *services.LikeService
	AuthMidlaware *middleware.AuthMiddleware
	mutex         sync.Mutex
}

func (rh *ReactHandler) React(w http.ResponseWriter, r *http.Request) {
	rh.mutex.Lock()
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	logeddUser, _ := rh.AuthMidlaware.IsUserLoggedIn(w, r)
	if logeddUser {
		// if liked == "post" {
		// 	err := rh.LikeService.Create(user.ID, ID, "", typeOfReact, liked)
		// 	if err != nil {
		// 		w.WriteHeader(http.StatusBadRequest)
		// 		return
		// 	}
		// } else {
		// 	err := rh.LikeService.Create(user.ID, "", ID, typeOfReact, liked)
		// 	if err != nil {
		// 		w.WriteHeader(http.StatusBadRequest)
		// 		return
		// 	}
		// }
		// data, err := rh.LikeService.GetLikes(ID, liked)
		// if err != nil {
		// 	utils.Error(w, http.StatusInternalServerError)
		// 	return
		// }
		// w.Header().Set("Content-Type", "application/json")
		// err = json.NewEncoder(w).Encode(data)
		// if err != nil {
		// 	utils.Error(w, http.StatusInternalServerError)
		// 	return
		// }
	} else {
		w.WriteHeader(http.StatusForbidden)
	}
	rh.mutex.Unlock()
}

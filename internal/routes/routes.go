package routes

import (
	"net/http"

	"real-time-forum/internal/handlers"
	"real-time-forum/internal/middleware"
	"real-time-forum/internal/utils"
)

func SetupRoutes(mux *http.ServeMux, authHandler *handlers.AuthHandler, postHandler *handlers.PostHandler, likeHandler *handlers.LikeHandler, authMiddleware *middleware.AuthMiddleware, messageHnadler *handlers.MessageHandler) {
	mux.HandleFunc("/ws", messageHnadler.MessageReceiver)

	mux.HandleFunc("/static/", utils.SetupStaticFilesHandlers)
	// /api/online-users
	mux.HandleFunc("/api/online-users", utils.RateLimitMiddleware(messageHnadler.GetOnlineUsers))
	mux.HandleFunc("/api/logout", utils.RateLimitMiddleware(authHandler.LogoutHandle))
	mux.HandleFunc("/api/register", utils.RateLimitMiddleware(authHandler.RegisterHandle))
	mux.HandleFunc("/api/login", utils.RateLimitMiddleware(authHandler.LoginHandle))
	mux.HandleFunc("/api/integrity", utils.RateLimitMiddleware(authHandler.UserIntegrity))
	mux.HandleFunc("/api/users", utils.RateLimitMiddleware(authHandler.GetUsers))
	mux.HandleFunc("/api/messages", utils.RateLimitMiddleware(authHandler.GetUsers))
	mux.HandleFunc("/api/checkUnreadMesg", utils.RateLimitMiddleware(messageHnadler.UnReadMessages))
	mux.HandleFunc("/api/markAsRead", utils.RateLimitMiddleware(messageHnadler.MarkReadMessages))

	mux.HandleFunc("/api/posts/", utils.RateLimitMiddleware(postHandler.Posts))
	mux.HandleFunc("/api/categories", utils.RateLimitMiddleware(postHandler.GetCategories))
	// mux.HandleFunc("/create", postHandler.PostCreation)

	mux.HandleFunc("/api/createpost", utils.RateLimitMiddleware(postHandler.PostSaver))

	mux.HandleFunc("/api/sendcomment", utils.RateLimitMiddleware(postHandler.CommentSaver))
	mux.HandleFunc("/api/comment/", utils.RateLimitMiddleware(postHandler.CommentGetter))

	mux.HandleFunc("/api/getmessages", utils.RateLimitMiddleware(messageHnadler.GetMessages))

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		utils.OpenHtml("index.html", w, nil)
	})
	mux.HandleFunc("/javascript", func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Referer") == "" {
			utils.Error(w, http.StatusNotFound)
			return
		}
		utils.Error(w, 1)
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		handler, pattern := mux.Handler(r)
		if pattern == "" || pattern == "/" && r.URL.Path != "/" {
			utils.Error(w, http.StatusNotFound)
			return
		}
		handler.ServeHTTP(w, r)
	})
}

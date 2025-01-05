package routes

import (
	"net/http"

	"real-time-forum/internal/handlers"
	"real-time-forum/internal/middleware"
	"real-time-forum/internal/utils"
)

func SetupRoutes(mux *http.ServeMux, authHandler *handlers.AuthHandler, postHandler *handlers.PostHandler, reactHandler *handlers.ReactHandler, authMiddleware *middleware.AuthMiddleware , messageHnadler *handlers.MessageHandler) {
	
	
	mux.HandleFunc("/ws", messageHnadler.MessageReceiver)
	
	mux.HandleFunc("/static/", utils.SetupStaticFilesHandlers)

	mux.HandleFunc("/api/online-users", messageHnadler.GetOnlineUsers)
	mux.HandleFunc("/api/logout", authHandler.LogoutHandle)
	mux.HandleFunc("/api/register", authHandler.RegisterHandle)
	mux.HandleFunc("/api/login", authHandler.LoginHandle)
	mux.HandleFunc("/api/integrity", authHandler.UserIntegrity)
	mux.HandleFunc("/api/users", authHandler.GetUsers)
	mux.HandleFunc("/api/messages", authHandler.GetUsers)

	mux.HandleFunc("/api/posts/", postHandler.Posts)
	mux.HandleFunc("/api/categories", postHandler.GetCategories)

	mux.HandleFunc("/api/createpost", postHandler.PostSaver)

	mux.HandleFunc("/api/sendcomment", postHandler.CommentSaver)
	mux.HandleFunc("/api/comment/", postHandler.CommentGetter)

	mux.HandleFunc("/api/reacts",reactHandler.React)
	// mux.HandleFunc("/like/", likeHandler.LikePost)
	// mux.HandleFunc("/dislike/", likeHandler.DisLikePost)
	// mux.HandleFunc("/likeComment/", likeHandler.LikeComment)
	// mux.HandleFunc("/dislikeComment/", likeHandler.DisLikeComment)
	// mux.HandleFunc("/filters", postHandler.PostFilter)

	mux.HandleFunc("/api/getmessages", messageHnadler.GetMessages)

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

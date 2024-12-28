package routes

import (
	"net/http"

	"real-time-forum/internal/handlers"
	"real-time-forum/internal/middleware"
	"real-time-forum/internal/utils"
)

func SetupRoutes(mux *http.ServeMux, authHandler *handlers.AuthHandler, postHandler *handlers.PostHandler, likeHandler *handlers.LikeHandler, authMiddleware *middleware.AuthMiddleware) {
	mux.HandleFunc("/static/", utils.SetupStaticFilesHandlers)

	mux.HandleFunc("/api/logout", authHandler.LogoutHandle)
	mux.HandleFunc("/api/register", authHandler.RegisterHandle)
	mux.HandleFunc("/api/login", authHandler.LoginHandle)
	mux.HandleFunc("/api/integrity", authHandler.UserIntegrity)

	// mux.HandleFunc("/", postHandler.Home)

	// mux.HandleFunc("/Posts/", postHandler.Posts)

	// mux.HandleFunc("/create", postHandler.PostCreation)

	// mux.HandleFunc("/createPost", postHandler.PostSaver)

	mux.HandleFunc("/api/sendcomment", postHandler.CommentSaver)
	// mux.HandleFunc("/detailsPost/", postHandler.DetailsPost)
	mux.HandleFunc("/comment", postHandler.CommentGetter)
	// mux.HandleFunc("/like/", likeHandler.LikePost)
	// mux.HandleFunc("/dislike/", likeHandler.DisLikePost)
	// mux.HandleFunc("/likeComment/", likeHandler.LikeComment)
	// mux.HandleFunc("/dislikeComment/", likeHandler.DisLikeComment)
	// mux.HandleFunc("/filters", postHandler.PostFilter)
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		utils.OpenHtml("index.html",w,nil)
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

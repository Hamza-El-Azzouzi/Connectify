package main

import (
	"fmt"
	"log"
	"net/http"

	"real-time-forum/internal"
	"real-time-forum/internal/database"
	"real-time-forum/internal/middleware"
	"real-time-forum/internal/routes"
	"real-time-forum/internal/utils"
)

func main() {
	db, err := database.InitDB("server_forum.db")
	if err != nil {
		log.Fatalf("error in DB : %v", err)
		return
	}

	err = database.RunMigrations(db)
	if err != nil {
		log.Fatalf("Error running migrations: %v", err)
		return
	}

	err = database.InsertDefaultCategories(db)
	if err != nil {
		log.Fatalf("error inserting default categories: %v", err)
		return
	}

	defer db.Close()

	userRepo, categoryRepo, postRepo, commentRepo, likeRepo, sessionRepo, chatRepo := internal.InitRepositories(db)

	authService, postService, categoryService, commentService, likeService, sessionService, chatService := internal.InitServices(userRepo,
		postRepo,
		categoryRepo,
		commentRepo,
		likeRepo,
		sessionRepo,
		chatRepo)

	authMiddleware := &middleware.AuthMiddleware{AuthService: authService, SessionService: sessionService}

	authHandler, postHandler, likeHandler, chatHandler := internal.InitHandlers(authService,
		postService,
		categoryService,
		commentService,
		likeService,
		sessionService,
		authMiddleware,
		chatService)

	cleaner := &utils.Cleaner{SessionService: sessionService}

	go cleaner.CleanupExpiredSessions()

	mux := http.NewServeMux()

	routes.SetupRoutes(mux, authHandler, postHandler, likeHandler, authMiddleware, chatHandler)

	fmt.Println("Starting the forum server...\nWelcome http://localhost:8080/")

	log.Fatal(http.ListenAndServe("0.0.0.0:8080", nil))
}

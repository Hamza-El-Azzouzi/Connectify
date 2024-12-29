package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"real-time-forum/internal/middleware"
	"real-time-forum/internal/models"
	"real-time-forum/internal/services"
	"real-time-forum/internal/utils"

	"github.com/gofrs/uuid/v5"
)

type PostHandler struct {
	AuthService     *services.AuthService
	AuthMidlaware   *middleware.AuthMiddleware
	CategoryService *services.CategoryService
	PostService     *services.PostService
	CommentService  *services.CommentService
	AuthHandler     *AuthHandler
}

// func (p *PostHandler) Home(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodGet {
// 		utils.Error(w, http.StatusMethodNotAllowed)
// 		return
// 	}
// 	utils.OpenHtml("index.html", w, nil)
// }

func (p *PostHandler) Posts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) != 3 {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	pagination := pathParts[2]
	if pagination == "" {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	nPagination, err := strconv.Atoi(pagination)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	posts, err := p.PostService.AllPosts(nPagination)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	categories, errCat := p.CategoryService.GetAllCategories()
	if errCat != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	data := map[string]any{
		"categories": categories,
		"posts":      posts,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func (p *PostHandler) PostSaver(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	var postData models.PostData

	err := json.NewDecoder(r.Body).Decode(&postData)
	defer r.Body.Close()
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if postData.Title == "" || postData.Content == "" || len(postData.Categories) == 0 {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	if len(postData.Title) > 250 || len(postData.Content) > 10000 {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	isLogged, usermid := p.AuthMidlaware.IsUserLoggedIn(w, r)
	if isLogged {
		err = p.PostService.PostSave(usermid.ID, postData.Title, postData.Content, postData.Categories)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
		} else {
			sendResponse(w, "Done")
		}
	} else {
		w.WriteHeader(http.StatusForbidden)
	}
}

func (p *PostHandler) DetailsPost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Error(w, http.StatusMethodNotAllowed)
		return
	}
	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) != 3 {
		utils.Error(w, http.StatusNotFound)
		return
	}
	postID := pathParts[2]
	if postID == "" {
		utils.Error(w, http.StatusNotFound)
		return
	}
	posts, err := p.PostService.GetPost(postID)
	if err != nil || posts.PostID == uuid.Nil {
		utils.Error(w, http.StatusNotFound)
		return
	}
	comment, err := p.CommentService.GetCommentByPost(postID, 0)
	if err != nil {
		utils.Error(w, http.StatusNotFound)
		return
	}
	data := map[string]any{
		"LoggedIn": false,
		"posts":    posts,
		"comment":  comment,
	}

	isLogged, usermid := p.AuthMidlaware.IsUserLoggedIn(w, r)

	if isLogged {
		data["LoggedIn"] = isLogged
		data["Username"] = usermid.Username
	} else {
		data["LoggedIn"] = isLogged
	}

	utils.OpenHtml("post-deatils.html", w, data)
}

func (p *PostHandler) CommentSaver(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	var commentData models.CommentData

	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&commentData)

	defer r.Body.Close()

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	isLogged, userId := p.AuthMidlaware.IsUserLoggedIn(w, r)
	if !isLogged {
		w.WriteHeader(http.StatusForbidden)
		return
	}
	commentData.Comment = strings.TrimSpace(commentData.Comment)
	if commentData.Comment == "" || len(commentData.Comment) > 10000 {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	err = p.CommentService.SaveComment(userId.ID, commentData.PostId, commentData.Comment)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	comment, err := p.CommentService.GetCommentByPost(commentData.PostId, 0)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(comment)
}

func (p *PostHandler) PostFilter(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		utils.Error(w, http.StatusMethodNotAllowed)
		return
	}

	filterby := ""
	var posts []models.PostWithUser
	var err error
	categorie := r.URL.Query().Get("categories")
	pagination := r.URL.Query().Get("pagination")
	nPagination, err := strconv.Atoi(pagination)
	if err != nil {
		utils.Error(w, http.StatusBadRequest)
		return
	}
	isLogged, usermid := p.AuthMidlaware.IsUserLoggedIn(w, r)

	if usermid != nil {
		filterby = r.URL.Query().Get("filterby")
	}
	if filterby != "" {
		posts, err = p.PostService.FilterPost(filterby, categorie, usermid.ID, nPagination)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			utils.Error(w, http.StatusInternalServerError)
			return
		}

	} else {
		posts, err = p.PostService.FilterPost(filterby, categorie, uuid.Nil, nPagination)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

	}
	data := map[string]any{
		"LoggedIn": false,
		"posts":    posts,
	}

	if isLogged {
		data["LoggedIn"] = isLogged
	} else {
		data["LoggedIn"] = isLogged
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func (p *PostHandler) CommentGetter(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	var err error
	postID := r.URL.Query().Get("postId")
	pagination := r.URL.Query().Get("offset")
	nPagination, err := strconv.Atoi(pagination)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	comment, err := p.CommentService.GetCommentByPost(postID, nPagination)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(comment)
}

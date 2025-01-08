package utils

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"text/template"
)

func GetPath() string {
	basePath := ""
	ex, err := os.Executable()
	if err != nil {
		log.Fatal(err)
	}
	if filepath.Dir(ex) == "/app" {
		basePath = ""
	} else {
		basePath = "../"
	}
	return basePath
}

func OpenHtml(fileName string, w http.ResponseWriter, data string) {
	basePath := GetPath()
	temp, err := template.ParseFiles(basePath + "templates/" + fileName)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if data == "404"{
		w.WriteHeader(http.StatusNotFound)
	}
	err = temp.Execute(w, nil)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func SetupStaticFilesHandlers(w http.ResponseWriter, r *http.Request) {
	path := ""
	basePath := GetPath()
	if basePath == "" {
		path = "/app/"
	} else {
		path = basePath
	}

	defer func() {
		err := recover()
		if err != nil {
			OpenHtml("index.html",w,"404")
		}
	}()

	fileinfo, err := os.Stat(path + r.URL.Path)
	if !os.IsNotExist(err) && !fileinfo.IsDir() {
		http.FileServer(http.Dir(basePath)).ServeHTTP(w, r)
	} else {
		OpenHtml("index.html",w,"404")
	}
}

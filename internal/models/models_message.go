package models

import (
	"time"

	"github.com/gorilla/websocket"
)

type Chat struct {
	Message string `json:"msg"`
	Sender  string `json:"session"`
	Reciver string `json:"id"`
}
type Client struct {
	Conn     *websocket.Conn
	LastPing time.Time
}

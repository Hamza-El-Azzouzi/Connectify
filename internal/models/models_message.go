package models

type Chat struct {
	Message string `json:"msg"`
	Sender  string `json:"session"`
	Reciver string `json:"id"`
}

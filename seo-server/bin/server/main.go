package main

import (
	"github.com/labstack/echo/v4"
	server "github.com/star-history/star-history"
)

const (
	instanceURL = "https://www.star-history.com"
)

func main() {
	e := echo.New()
	frontendService := server.NewFrontendService(instanceURL)
	frontendService.Serve(e)
	e.Logger.Fatal(e.Start(":8080"))
}

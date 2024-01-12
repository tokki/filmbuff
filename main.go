package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
	"log"
	"strings"
)

var db *sqlx.DB

type Seed struct {
	Id       uint   `db:"id" json:"id"`
	Imdb     string `db:"imdb" json:"imdb"`
	Douban   string `db:"douban" json:"douban"`
	Filename string `db:"filename" json:"filename"`
	Size     string `db:"size" json:"size"`
	Quality  string `db:"quality" json:"quality"`
	Magnet   string `db:"magnet" json:"magnet"`
}

func getSeed(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")
	c.Header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, UPDATE")
	c.Header("Access-Control-Allow-Credentials", "true")

	imdb := c.DefaultQuery("imdb", "")
	if !strings.Contains(imdb, "tt") {
		c.JSON(404, gin.H{"seeds": "[]"})
		return
	}
	var seeds []Seed
	err := db.Select(&seeds, "SELECT * FROM seed WHERE imdb=?", imdb)
	fmt.Println(seeds)
	if err != nil {
		c.JSON(200, gin.H{"seeds": "[]"})
		return
	}
	c.JSON(200, gin.H{"seeds": seeds})
}

func main() {
	var err error
	db, err = sqlx.Connect("sqlite3", "./godard.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()
	r.GET("/api", getSeed)
	r.Run(":8888")
}

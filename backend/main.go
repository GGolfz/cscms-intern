package main

import (
	"errors"
	"fmt"
	"github.com/GGolfz/cscms-intern/backend/dto"
	"github.com/GGolfz/cscms-intern/backend/model"
	"github.com/gofiber/fiber/v2"
	"github.com/hashicorp/go-hclog"
	"github.com/kofoworola/godate"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"os"
	"time"
)

func main() {
	logger := hclog.Default()

	dbHost, dbPort, dbUser, dbPass, dbName := getDBEnv()
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", dbUser, dbPass, dbHost, dbPort, dbName)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	assertErrorAndExitIfFound(logger, "unable to connect to db", err)

	err = db.AutoMigrate(&model.Internship{}, &model.Position{})
	assertErrorAndExitIfFound(logger, "unable to run auto migration", err)

	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			// Default to 500
			code := fiber.StatusInternalServerError
			message := err.Error()

			// Check if error is fiber.Error type
			if e, ok := err.(*fiber.Error); ok {
				// Override status code if fiber.Error type
				code = e.Code
				message = e.Message
			}

			c.Status(code)

			return c.JSON(fiber.Map{
				"code":    code,
				"message": message,
			})
		},
	})

	app.Get("/api/ping", func(ctx *fiber.Ctx) error {
		return ctx.JSON(fiber.Map{
			"message":   "pong",
			"timestamp": time.Now(),
		})
	})

	app.Post("/api/internship", func(ctx *fiber.Ctx) error {
		internshipBody := new(dto.CreateInternshipDto)

		if err := ctx.BodyParser(internshipBody); err != nil {
			logger.Error("cannot parse request body", err.Error())
			return fiber.NewError(fiber.StatusBadRequest, "cannot parse request body", err.Error())
		}

		positions := make([]*model.Position, len(internshipBody.Positions))
		for i, pos := range internshipBody.Positions {
			position := &model.Position{Name: pos}
			var foundPosition model.Position

			tx := db.Where(position).First(&foundPosition)
			if tx.Error != nil {
				if !errors.Is(tx.Error, gorm.ErrRecordNotFound) {
					logger.Error("cannot query position data from db", err.Error())
					return fiber.NewError(fiber.StatusInternalServerError, "cannot query position data from db", err.Error())
				}
				// New position
				if tx := db.Create(position); tx.Error != nil {
					logger.Error("cannot query position data from db", err.Error())
					return fiber.NewError(fiber.StatusInternalServerError, "cannot query position data from db", err.Error())
				}
				positions[i] = position
			} else {
				// Existing position
				positions[i] = &foundPosition
			}
		}

		internship := &model.Internship{
			CreatedAt:   time.Now().UTC(),
			UpdatedAt:   time.Now().UTC(),
			CompanyName: internshipBody.CompanyName,
			URL:         internshipBody.URL,
			CloseDate:   godate.Create(internshipBody.CloseDate).EndOfDay().Time,
			Positions:   positions,
		}

		tx := db.Create(internship)
		if tx.Error != nil {
			logger.Error("cannot create record in db", tx.Error.Error())
			return fiber.NewError(fiber.StatusInternalServerError, "cannot create record in db", tx.Error.Error())
		}

		return ctx.JSON(internship)
	})

	app.Get("/api/internship", func(ctx *fiber.Ctx) error {
		var internships []model.Internship

		if tx := db.Preload("Positions").Find(&internships); tx.Error != nil {
			if !errors.Is(tx.Error, gorm.ErrRecordNotFound) {
				logger.Error("cannot get internship in db", tx.Error.Error())
				return fiber.NewError(fiber.StatusInternalServerError, "cannot get internship in db", tx.Error.Error())
			}
		}
		return ctx.JSON(internships)
	})

	err = app.Listen(":5000")
	assertErrorAndExitIfFound(logger, "unable to listen", err)

}

func getDBEnv() (string, string, string, string, string) {
	username := os.Getenv("DB_USERNAME")
	password := os.Getenv("DB_PASSWORD")
	port := os.Getenv("DB_PORT")
	host := os.Getenv("DB_HOST")
	dbname := os.Getenv("DB_DATABASE")

	return host, port, username, password, dbname
}

func assertErrorAndExitIfFound(logger hclog.Logger, msg string, err error) {
	if err != nil {
		logger.Error(msg, err.Error())
		os.Exit(1)
	}
}

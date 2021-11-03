package model

import (
	"time"
)

type Position struct {
	ID         uint          `gorm:"primaryKey,autoIncrement" json:"id"`
	CreatedAt  time.Time     `json:"created_at"`
	UpdatedAt  time.Time     `json:"updated_at"`
	Name       string        `json:"name"`
	Internship []*Internship `gorm:"many2many:intern_position;" json:"internship"`
}

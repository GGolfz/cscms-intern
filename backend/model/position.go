package model

import "gorm.io/gorm"

type Position struct {
	gorm.Model
	Name       string        `json:"name"`
	Internship []*Internship `gorm:"many2many:intern_position;"`
}

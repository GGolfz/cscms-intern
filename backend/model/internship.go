package model

import "time"

type Internship struct {
	ID          uint        `gorm:"primaryKey,autoIncrement" json:"id"`
	CreatedAt   time.Time   `json:"created_at"`
	UpdatedAt   time.Time   `json:"updated_at"`
	CompanyName string      `json:"company_name"`
	URL         string      `json:"url"`
	CloseDate   *time.Time   `json:"close_date"`
	Positions   []*Position `gorm:"many2many:intern_position;" json:"positions"`
}

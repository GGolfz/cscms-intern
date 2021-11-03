package dto

import "time"

type CreateInternshipDto struct {
	CompanyName string    `json:"company_name"`
	URL         string    `json:"url"`
	Positions   []string  `json:"positions"`
	CloseDate   time.Time `json:"close_date"`
}

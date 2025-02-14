package entity

import (
	"gorm.io/gorm"
)

type Activity struct {
	gorm.Model
	Name string `gorm:"uniqueIndex"`
	ActivityImg    string    `valid:"required~Image is required"`

	BookActivity []BookActivity `gorm:"foreignKey:ActivityID"`
}
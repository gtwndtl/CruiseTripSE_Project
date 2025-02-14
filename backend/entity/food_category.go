package entity

import (
	"gorm.io/gorm"
)

type FoodCategories struct {
	gorm.Model
	FoodCategoryName  string `valid:"required~FoodCategoryName is required"`
	FoodCategoryImage string `gorm:"type:longtext" valid:"required~FoodCategoryImage is required"`
}
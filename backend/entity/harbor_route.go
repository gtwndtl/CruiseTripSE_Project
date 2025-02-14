package entity

import "gorm.io/gorm"

type Harbor_Route struct {
	gorm.Model

	RouteID uint    `json:"route_id"`
	Route   *Routes `gorm:"foreignKey: RouteID" json:"route"`

	HarborID uint     `json:"harbor_id"`
	Harbor   *Harbors `gorm:"foreignKey: HarborID" json:"harbor"`
	
	Level uint8 `json:"level"`
}

package entity

import (
	// "team03/se67/entity/hr_system"
	"gorm.io/gorm"
)
type Routes struct {

   gorm.Model
   RouteName string `json:"route_name"`

   WeatherID  uint      `json:"weather_id"`
   Weather   *Weathers  `gorm:"foreignKey: WeatherID" json:"weather"`

}

package config

import (

    "team03/se67/entity"

)


func SetupRouteDatabase() {


   db.AutoMigrate(

       &entity.Routes{},
       &entity.Harbor_Route{},
       &entity.Harbors{},
       &entity.Weathers{},
   )

   Route  := &entity.Routes{
       RouteName: "เทียนจิน (CHINA) - นางาซากิ (JAPAN) - เทียนจิน (CHINA)",
       WeatherID: 1,
   }
   db.FirstOrCreate(Route, &entity.Routes{RouteName: "เทียนจิน (CHINA) - นางาซากิ (JAPAN) - เทียนจิน (CHINA)",})


   HarborChina := &entity.Harbors{
       HarborName: "ท่าเรือเทียนจิน",
       Country: "CHINA",
   }
   HarborJapan := &entity.Harbors{
       HarborName: "ท่าเรือนางาซากิ",
       Country: "JAPAN",
    }
   db.FirstOrCreate(HarborChina, &entity.Harbors{HarborName: "ท่าเรือเทียนจิน",})
   db.FirstOrCreate(HarborJapan, &entity.Harbors{HarborName: "ท่าเรือนางาซากิ",})


   Harbor_route01 := &entity.Harbor_Route{
       RouteID: 1,
       HarborID: 1,
       Level: 1,
   }
   Harbor_route02 := &entity.Harbor_Route{
       RouteID: 1,
       HarborID: 2,
       Level: 2,
   }
   Harbor_route03 := &entity.Harbor_Route{
       RouteID: 1,
       HarborID: 1,
       Level: 3,
   }  
   db.FirstOrCreate(Harbor_route01, &entity.Harbor_Route{Level: 1,})
   db.FirstOrCreate(Harbor_route02, &entity.Harbor_Route{Level: 2,})
   db.FirstOrCreate(Harbor_route03, &entity.Harbor_Route{Level: 3,})


   Clear := &entity.Weathers{Weather: "Clear"}
   Cloudy := &entity.Weathers{Weather: "Cloudy"}
   Rainy := &entity.Weathers{Weather: "Rainy"}
   Snowy := &entity.Weathers{Weather: "Snowy"}
   Windy := &entity.Weathers{Weather: "Windy"}
   db.FirstOrCreate(Clear, &entity.Weathers{Weather: "Clear"})
   db.FirstOrCreate(Cloudy, &entity.Weathers{Weather: "Cloudy"})
   db.FirstOrCreate(Rainy, &entity.Weathers{Weather: "Rainy"})
   db.FirstOrCreate(Snowy, &entity.Weathers{Weather: "Snowy"})
   db.FirstOrCreate(Windy, &entity.Weathers{Weather: "Windy"})
}
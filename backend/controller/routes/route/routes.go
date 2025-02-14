package route


import (

   "net/http"
   "github.com/gin-gonic/gin"
   "team03/se67/config"
   "team03/se67/entity"

)


func GetAll(c *gin.Context) {
   var routes []entity.Routes
   db := config.DB()

   results := db.Preload("Weather").Find(&routes)

   if results.Error != nil {
       c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
       return
   }
   c.JSON(http.StatusOK, routes)
}


func Get(c *gin.Context) {
   var route entity.Routes
   ID := c.Param("id")
   db := config.DB()

   results := db.Preload("Weather").First(&route, ID)

   if results.Error != nil {
       c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
       return
   }
   if route.ID == 0 {
       c.JSON(http.StatusNoContent, gin.H{})
       return
   }
   c.JSON(http.StatusOK, route)
}


func Update(c *gin.Context) {
   var route entity.Routes
   RouteID := c.Param("id")
   db := config.DB()

   result := db.First(&route, RouteID)

   if result.Error != nil {
       c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
       return
   }
   if err := c.ShouldBindJSON(&route); err != nil {
       c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
       return

   }

   result = db.Save(&route)

   if result.Error != nil {
       c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
       return
   }
   c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}


func Delete(c *gin.Context) {
   id := c.Param("id")
   db := config.DB()

   if tx := db.Exec("DELETE FROM routes WHERE id = ?", id); tx.RowsAffected == 0 {
       c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
       return
   }
   c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
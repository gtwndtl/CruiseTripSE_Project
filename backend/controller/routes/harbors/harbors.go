package harbors


import (
   "net/http"
   "github.com/gin-gonic/gin"
   "team03/se67/config"
   "team03/se67/entity"
)


func GetAll(c *gin.Context) {
   var harbors []entity.Harbors
   db := config.DB()

   results := db.Find(&harbors)

   if results.Error != nil {
       c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
       return
   }
   c.JSON(http.StatusOK, harbors)
}


func Get(c *gin.Context) {
   var harbor entity.Harbors
   ID := c.Param("id")
   db := config.DB()

   results := db.First(&harbor, ID)

   if results.Error != nil {
       c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
       return
   }
   if harbor.ID == 0 {
       c.JSON(http.StatusNoContent, gin.H{})
       return
   }
   c.JSON(http.StatusOK, harbor)
}


func Update(c *gin.Context) {
   var harbor entity.Harbors
   HarborID := c.Param("id")
   db := config.DB()

   result := db.First(&harbor, HarborID)

   if result.Error != nil {
       c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
       return
   }
   if err := c.ShouldBindJSON(&harbor); err != nil {
       c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
       return
   }

   result = db.Save(&harbor)

   if result.Error != nil {
       c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
       return
   }
   c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}


func Delete(c *gin.Context) {
   id := c.Param("id")
   db := config.DB()

   if tx := db.Exec("DELETE FROM harbors WHERE id = ?", id); tx.RowsAffected == 0 {
       c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
       return
   }
   c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}
package harbor_routes


import (
   "net/http"
   "github.com/gin-gonic/gin"
   "team03/se67/config"
   "team03/se67/entity"
)


func GetAll(c *gin.Context) {
   var harbor_rs []entity.Harbor_Route
   db := config.DB()

   results := db.Preload("Harbor").Preload("Route").Find(&harbor_rs)

   if results.Error != nil {
       c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
       return
   }
   c.JSON(http.StatusOK, harbor_rs)
}

func Get(c *gin.Context) {
    // ดึง Route ID จาก parameter
    routeId := c.Param("route_id")
    db := config.DB()
    // ค้นหา HarborRoute โดยใช้ Route ID
    var harborRoutes []entity.Harbor_Route
    result := db.Where("route_id = ?", routeId).Find(&harborRoutes)
    
    // ตรวจสอบว่าเจอข้อมูลหรือไม่
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{ "error": "Error retrieving HarborRoutes" })
        return
    }
    
    if len(harborRoutes) == 0 {
        c.JSON(http.StatusNotFound, gin.H{ "message": "Not found for this RouteID" })
        return
    }

    // ส่งข้อมูลกลับไปยัง client
    c.JSON(http.StatusOK, gin.H{"data": harborRoutes })
}


func Update(c *gin.Context) {
   var harbor_r entity.Harbor_Route
   harbor_rID := c.Param("id")
   db := config.DB()

   result := db.First(&harbor_r, harbor_rID)

   if result.Error != nil {
       c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
       return
   }
   if err := c.ShouldBindJSON(&harbor_r); err != nil {
       c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
       return
   }

   result = db.Save(&harbor_r)

   if result.Error != nil {
       c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
       return
   }
   c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}


func Delete(c *gin.Context) {
    id := c.Param("id")
    db := config.DB()

    // ลบข้อมูลในตาราง HarborRoute ที่มี route_id ตรงกัน
    if tx := db.Exec("DELETE FROM harbor_routes WHERE route_id = ?", id); tx.RowsAffected == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "No related HarborRoute found"})
        return
    }

    // ลบข้อมูลในตาราง Route
    if tx := db.Exec("DELETE FROM routes WHERE id = ?", id); tx.RowsAffected == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Route not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}
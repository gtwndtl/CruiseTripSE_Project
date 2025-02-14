package food_service

import (
	// "fmt"
	"net/http"
	"team03/se67/config"
	"team03/se67/entity"
	// "time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AddItemRequest struct {
	OrderID         uint                    `json:"order_id"`
	MenuID          uint                    `json:"menu_id"`
	Quantity        int                     `json:"quantity"`
	SelectedOptions []struct {
        MenuOptionID uint `json:"menu_option_id"`
    } `json:"selected_options"` // Each option is now an object with menu_option_id
}

// GetPendingOrderByCustomerID retrieves the pending order for a specific customer
func GetPendingOrderByGuestID(c *gin.Context) {
	customerID := c.Param("id") // รับ CustomerID จาก URL
	var order entity.Orders
	db := config.DB()

	// ดึง Order ที่มีสถานะ Pending และ CustomerID ตรงกัน
	if err := db.Preload("OrderDetails").
		Preload("OrderDetails.Menu").
		Where("guest_id = ? AND status_id = ?", customerID, 4).
		First(&order).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "No pending orders found for this customer"})
		return
	}

	c.JSON(http.StatusOK, order)
}

func AddItemToOrder(c *gin.Context) {
    var request AddItemRequest
    if err := c.ShouldBindJSON(&request); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }

    db := config.DB()

    // Extract MenuOptionIDs from the request
    var selectedOptionIDs []uint
    for _, option := range request.SelectedOptions {
        selectedOptionIDs = append(selectedOptionIDs, option.MenuOptionID)
    }

    // Search for existing order details
    var existingOrderDetails []entity.OrderDetails
    db.Where("order_id = ? AND menu_id = ?", request.OrderID, request.MenuID).
        Find(&existingOrderDetails)

    var matchingOrderDetail *entity.OrderDetails
    for _, detail := range existingOrderDetails {
        var existingOptions []uint
        var detailOptions []entity.OrderDetailMenuOptions
        db.Where("order_detail_id = ?", detail.ID).Find(&detailOptions)

        for _, option := range detailOptions {
            existingOptions = append(existingOptions, option.MenuItemOptionID)
        }

        // Compare options
        if isSameOptions(existingOptions, selectedOptionIDs) {
            matchingOrderDetail = &detail
            break
        }
    }

    if matchingOrderDetail == nil {
        // Create a new OrderDetail if no matching order detail was found
        newOrderDetail := entity.OrderDetails{
            OrderID:  request.OrderID,
            MenuID:   request.MenuID,
            Quantity: request.Quantity,
            Amount:   calculateAmount(db, request.MenuID, request.Quantity, selectedOptionIDs),
        }
        if err := db.Create(&newOrderDetail).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order detail"})
            return
        }

        // Create new OrderDetailMenuOption entries
        for _, optionID := range selectedOptionIDs {
            newOption := entity.OrderDetailMenuOptions{
                OrderDetailID:    newOrderDetail.ID,
                MenuItemOptionID: optionID,
            }
            if err := db.Create(&newOption).Error; err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order detail menu option"})
                return
            }
        }
    } else {
        // Update existing OrderDetail
        matchingOrderDetail.Quantity += request.Quantity
        matchingOrderDetail.Amount = calculateAmount(db, request.MenuID, matchingOrderDetail.Quantity, selectedOptionIDs)
        if err := db.Save(matchingOrderDetail).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order detail"})
            return
        }
    }

    c.JSON(http.StatusOK, gin.H{"message": "Item added/updated successfully"})
}


// isSameOptions checks if two sets of options are the same
func isSameOptions(existingOptions, selectedOptions []uint) bool {
    if len(existingOptions) != len(selectedOptions) {
        return false
    }

    // Use a map to compare
    optionMap := make(map[uint]bool)
    for _, option := range existingOptions {
        optionMap[option] = true
    }

    for _, option := range selectedOptions {
        if !optionMap[option] {
            return false
        }
    }

    return true
}


// calculateAmount คำนวณ Amount โดยรวมราคาของเมนูและราคา Extra ของ Options
func calculateAmount(db *gorm.DB, menuID uint, quantity int, selectedOptions []uint) float64 {
	var menu entity.Menus
	db.First(&menu, menuID)

	var extraPrice float64
	for _, optionID := range selectedOptions {
		var option entity.MenuItemOptions
		db.Preload("MenuOption").First(&option, optionID)
		extraPrice += float64(option.MenuOption.ExtraPrice)
	}

	return float64(menu.Price)*float64(quantity) + extraPrice*float64(quantity)
}
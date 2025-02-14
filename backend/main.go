package main

import (
	"team03/se67/config"
	"team03/se67/routers"
	"team03/se67/servers"
)

func main() {
	// เปิดการเชื่อมต่อฐานข้อมูล
	config.ConnectionDB()
	// สร้างฐานข้อมูล
	config.SetupDatabase()

	// เรียกใช้ Router จาก package routers
	r := routers.SetupRouter()

	go servers.Server()

	// เริ่มต้น server
	r.Run("localhost:" + routers.PORT)
}


import OnCruiseShipHome from '../../../assets/11960036_2560_1440_24fps.mp4'
import './OnCruiseShipHomePage.css'

function OnCruiseShipHomePage() {

    const handleClick = (menuName: string) => {
        // setMenu(menuName);
        // setShowMenuFood(menuName === "food-service");
    
        // บันทึกสถานะปัจจุบันลง localStorage
        localStorage.setItem("menu", menuName);
        localStorage.setItem(
          "showMenuFood",
          JSON.stringify(menuName === "food-service")
        );
    
        if (menuName === "activity") {
            location.href =("/cruise-ship/login/home/activity");
        } else if (menuName === "food-service") {
            location.href =("/cruise-ship/login/home/food-service");
        }
      };

  return (
    <section className="on-cruise-ship-home-page-container">
        <div className="header">
            <div className="overlay"></div>
            <video src={OnCruiseShipHome} autoPlay loop muted></video>
        </div>
        <div className="service-container">
            <h1>Service</h1>
            <div className="service-content">
                <div className="activity">
                    <div className="detail">
                        <p>Enhance your cruise experience with our Smart Activity Booking System! Effortlessly reserve onboard services tailored to your preferences. Easily add activities by specifying the desired date and time, the number of participants, contact details, and special requests.</p>
                        <button onClick={()=> handleClick("activity")}>Enjoy Activities</button>
                    </div>
                    <img src="https://th.bing.com/th/id/R.1fc1022962633bc79bb20e1012de096f?rik=sVeczc9rjbTxpQ&pid=ImgRaw&r=0" alt="" />
                </div>
                <div className="food-service">
                        <img src="https://cdn.healthnwell.com/healthnwell/wp-content/uploads/2018/04/a75bbe63-c290-4899-a933-e83a242668c3.jpg" alt="" />
                    <div className="detail">
                        <p>Our food service system lets you easily browse and select food and drinks. Filter by category, choose your items and quantities, review your cart, and confirm your order—all in one convenient process!</p>
                        <button onClick={()=> handleClick("food-service")}>Explore a World of Flavors</button>
                    </div>
                </div>
            </div>
        </div>
        {/* <div className="about-container">
            <h1>About Cruise Ship</h1>
            <div className="about-content">
                <img src="https://wallpaperaccess.com/full/842290.jpg" alt="" />
                <p>Cruise Ship is your gateway to exceptional cruise experiences. We specialize in managing all aspects of your voyage, from bookings to activities, ensuring a seamless and memorable journey for both customers and employees. Our system integrates advanced features for trip management, room selection, and activity planning, creating the perfect cruise experience for all.</p>
            </div>
        </div> */}
    </section>
  )
}

export default OnCruiseShipHomePage
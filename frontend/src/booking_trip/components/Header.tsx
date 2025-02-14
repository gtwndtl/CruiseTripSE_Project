import { Link } from "react-router-dom"
import "./Header.css"

function Header() {

  return (
    <>
    <div className='header'>
      <head>
            <meta charSet="utf-8"></meta>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"></link>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"></link>
      </head>
        <div className="icon-right">
          <Link to="/showbookingtrip" className="link-icon" style={{ textDecoration: 'none', color: 'inherit' }}>
            <i className="fa-solid fa-ship fa-2xl" style={{color:"#133e87"}}></i>
          </Link>
          <Link to="/showbookingcabin" className="link-icon" style={{ textDecoration: 'none', color: 'inherit' }}>
            <i className="fa-solid fa-bed fa-2xl" style={{color:"#133e87"}}></i>
          </Link>
        </div>
        <div className="icon-left">
          <Link to="/cruisetrip" className="link-icon" style={{ textDecoration: 'none', color: 'inherit' }}>
            <i className="fa-solid fa-house fa-2xl" style={{color:"#133e87"}}></i>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Header
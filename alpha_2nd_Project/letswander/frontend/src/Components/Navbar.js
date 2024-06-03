import { useEffect, useState } from "react";
import search from "./../Assets/search.png";
import { Link, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";


export default function Navbar(props) {
  let cookies = new Cookies();
  const photo = cookies.get("photo");
  const [data, setData] = useState("");
  const userName = cookies.get("username");

  const location = useLocation();
  const [bgColor, setBgColor] = useState('rgba(255, 255, 255, 1)');
  const [color, setColor] = useState('rgba(255, 255, 255, 1)');

  useEffect(() => {
    const handleScroll = () => {
      const isTop = window.scrollY < 120;
      if (location.pathname === '/') {
        setBgColor('rgba(0, 0, 0, 0.7)');
        setColor("white")
      } else {
        setBgColor('rgb(226, 226, 226)');
        setColor("black")
      }
    };

    handleScroll(); // Check on initial load
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);


  return (
    <>
        <div className="navbar" style={{ backgroundColor: bgColor}}>
          <ul>
            <li style={{color:color}}>Passport</li>
          </ul>

          {photo && cookies.get("token") ? (
            <Link to="/dashboard">
              <img src={photo} alt="User photo" className="userPhoto" />
            </Link>
          ) : userName ? (
            <Link to="/dashboard">
            <div className="acc-cont userPhoto">
              <button>{userName.substring(0, 1)}</button>
            </div>
            </Link>
          ) : (
            <Link to="/login">
              <button className="login-btn">Login</button>
            </Link>
          )}

        </div>
    </>
  );
}
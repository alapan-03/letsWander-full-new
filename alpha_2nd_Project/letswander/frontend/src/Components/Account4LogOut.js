import { addItem } from "./../redux/slices/cartSlice";
import { initializeApp } from "firebase/app";
import Cookies from "universal-cookie";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import CustomToast from "./CustomToast";

const firebaseConfig = {
  apiKey: "AIzaSyD94aJZKNp1dzOjRyD3cMtLxcHzSyaWE5U",
  authDomain: "letswander-6110c.firebaseapp.com",
  projectId: "letswander-6110c",
  storageBucket: "letswander-6110c.appspot.com",
  messagingSenderId: "745673402765",
  appId: "1:745673402765:web:a103e63d0e25a86311b5c4",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Account4LogOut(props) {
  let cookies = new Cookies();
  let navigate = useNavigate();

  const [showSignOutToast, setShowSignOutToast] = useState(false);
  const [showSignOutToastError, setShowSignOutToastError] = useState(false);

  const signOutFunc = async () => {
    try {
      await signOut(auth);
      console.log("Signed out");
      localStorage.removeItem("hasShownToastLogOut");
      cookies.remove("token");
      cookies.remove("photo");
      cookies.remove("username");
      localStorage.removeItem("userName");
      // cookies.remove("setPhoto")
      // window.location.reload();
      localStorage.removeItem("notificationShown");
      setShowSignOutToast(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error signing out:", error);
      setShowSignOutToastError(true);
    }
  };

  return (
    <>
      <div className="logoutSection">
        {showSignOutToast && (
          <CustomToast message="Logout successful!" isError={false} />
        )}
        {showSignOutToastError && (
          <CustomToast message="Logout failed!" isError={true} />
        )}

        <div className="logoutSec-p-div">
          <p className="logout-p1">Do you really want to sign out?</p>
          <p className="logout-p2">😔</p>
        </div>

        <button className="logoutSec-btn" onClick={signOutFunc}>
          Logout
        </button>
      </div>
    </>
  );
}

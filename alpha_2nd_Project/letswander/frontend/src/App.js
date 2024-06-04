import logo from './logo.svg';
import './App.css';
import Component1 from './Components/Component1';
import Component2 from './Components/Component2';
import Component3 from './Components/Component3';
import { useState } from 'react';
import Component4 from './Components/Component4';
import Component5 from './Components/Component5';
import Component6 from './Components/Component6';
import Component7 from './Components/Component7';
import Footer from './Components/Footer';
import Comp1 from "./Components/Comp1";
import { useEffect } from "react"
import {io} from "socket.io-client"
import {createContext } from "react";
import AdditionalDetails from './Components/AdditionalDetails';
import Banner from './Components/Banner';
import Cookies from 'universal-cookie';
import Chat from './Components/Chat';
import Navbar from './Components/Navbar';
// import { ToastContainer, toast, Bounce } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import url from "./Components/rootUrl"
import { useNavigate } from 'react-router-dom';
import CustomToast from './Components/CustomToast';

export const UserContext = createContext()

const socket = io('https://letswander-full-new.onrender.com');



function App() {
  
  const cookie = new Cookies();
  const navigate = useNavigate()

  const [isSigned, setIsSigned] = useState()
  const [token, setToken] = useState(cookie.get("token"));
  const [sessionId, setSessionId] = useState(cookie.get("paymentDone"));
  const [data, setData] = useState("");
  const [apiData, setApiData] = useState([]);
  const [dataId, setDataId] = useState("");
  const [message, setMessage] = useState('');
  const [tourId, setTourId] = useState(cookie.get("tourId"));
  const [me, setMe] = useState(null)
  const [showCustomToast, setShowCustomToast] = useState(false)
  const [showCustomToast2, setShowCustomToast2] = useState(false)

  // const token = cookie.get("token");
  const stringWithoutQuotes = token && token.replace(/"/g, "");


  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await fetch(`${url}/api/v1/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${stringWithoutQuotes}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setMe(result?.user);
        }
      } catch (err) {
        console.error("Error making GET request:", err.message);
      }
    };

    fetchMe();
  }, [stringWithoutQuotes]);


  useEffect(() => {
    const handleSessionIdChange = () => {
      const currentSessionId = cookie.get("sessionId");
      const previousSessionId = localStorage.getItem("previousSessionId");

      if (currentSessionId && currentSessionId !== previousSessionId) {
        setShowCustomToast2(true);
        localStorage.setItem("previousSessionId", currentSessionId);

        // Hide the toast after 5 seconds
        setTimeout(() => {
          setShowCustomToast2(false);
        }, 5000);
      }
    };

    handleSessionIdChange(); // Check on initial load
    window.addEventListener("storage", handleSessionIdChange);

    return () => {
      window.removeEventListener("storage", handleSessionIdChange);
    };
  }, []);
  


  useEffect(() => {
    const handleTokenChange = () => {
      const currentToken = cookie.get("token");
      const previousToken = localStorage.getItem("previousToken");

      if (currentToken && currentToken !== previousToken) {
        setShowCustomToast(true);
        localStorage.setItem("previousToken", currentToken);

        // Hide the toast after 5 seconds
        setTimeout(() => {
          setShowCustomToast(false);
        }, 5000);
      }
    };

    handleTokenChange(); // Check on initial load
    window.addEventListener("storage", handleTokenChange);

    return () => {
      window.removeEventListener("storage", handleTokenChange);
    };
  }, [token]);


  
  function searchHand(e){
    setData(e);
  }

  function setApi(e){
    setApiData(e);
  }

  function setId(e){
    setDataId(e);
  }


  // useEffect(()=>{
  //   setShowCustomToast(true)
  // }, [cookie.get("token")])

  // console.log(token)

  return (
    <div className='app-cont'>



    {showCustomToast &&<CustomToast message="Login successful!" isError={false}/>}
    {showCustomToast2 && (
        <CustomToast message="Payment successful" isError={false}/>
      )}

    {me && me?.role === "admin" || me?.role === "guide" ? 
      <Chat/>
    : (
      <div>
    <Component1 search={searchHand} apiData={apiData}/>
    <Component2 data={data} apiData={setApi} dataId={setId}/>
    <Banner/>
    <Component3 data={data} apiData={apiData}/>
    <Component4 apiData={apiData}/>
    <Component5/>
    <Component6/>
    <Component7/>
    <Footer/>
    </div>
)}
</div>
);
}

export default App;

import Account1 from "./Account1";
import Navbar from "./Navbar";
import Account2 from "./Account2";
import Account3Bookings from "./Account3Bookings";
import { useState, useEffect } from "react";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Account4LogOut from "./Account4LogOut";

export default function Account(props) {
  const [menu, setMenuSt] = useState("account");
  const [updated, setUpdated] = useState(false);

  function setMenu(e) {
    setMenuSt(e);
  }

  function handleUpdate(){
    setUpdated(true)
  }


  useEffect(() => {
    const hasShownToastUpdate = localStorage.getItem('hasShownToastUpdate');

    if (updated && !hasShownToastUpdate) {
      const timeout = setTimeout(() => {
        toast.success('Successfully updated');
        localStorage.setItem('hasShownToastUpdate', 'true');
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [updated]);

  // useEffect(() => {
  //   const hasShownToastUpdateError = localStorage.getItem('hasShownToastUpdateError');

  //   if (updated && !hasShownToastUpdateError) {
  //     const timeout = setTimeout(() => {
  //       toast.error('Update error!');
  //       localStorage.setItem('hasShownToastUpdateError', 'true');
  //     }, 1000);

  //     return () => clearTimeout(timeout);
  //   }
  // }, [updated]);

  

  return (
    <>

<ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition= {Bounce}
/>
{/* Same as */}
<ToastContainer />

      <Navbar />
      <div className="dashboard-parent">
        <Account1 menuItem={setMenu} />
        {menu === "account" ? (
          <Account2 updated={handleUpdate} />
        ) : menu === "bookings" ? (
          <Account3Bookings />
        ) : (
          <p><Account4LogOut/></p>
        )}
      {/* <Account4LogOut/> */}
      </div>
    </>
  );
}

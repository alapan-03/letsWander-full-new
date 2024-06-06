import Account1 from "./Account1";
import Navbar from "./Navbar";
import Account2 from "./Account2";
import Account3Bookings from "./Account3Bookings";
import { useState, useEffect } from "react";
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
        // toast.success('Successfully updated');
        localStorage.setItem('hasShownToastUpdate', 'true');
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [updated]);


  return (
    <>

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

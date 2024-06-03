import { CircleUserRound } from 'lucide-react';
import { CalendarCheck } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { useState } from 'react';


export default function Account1(props) {

    const [clicked, setClicked] = useState("account");

    return(
        <>
        <div className="dashboard">
            <div className="dash-i1">
                <p className='dash-p1'>General</p>
                <div className={`dash-div ${clicked === "account" ? "dash-clicked" : ""}`} onClick={()=>{setClicked("account"); props.menuItem("account")}}>
                <CircleUserRound color='#5c5c5c' />
                    <p>Account details</p>
                </div>
                <div className={`dash-div ${clicked === "bookings" ? "dash-clicked" : ""}`} onClick={()=>{setClicked("bookings"); props.menuItem("bookings")}}>
                    <CalendarCheck color='#5c5c5c'/>
                    <p>Bookings</p>
                </div>
            </div>

            <div className="dash-i2">
                <p className='dash-p1'>More</p>
                <div className={`dash-div ${clicked === "logout" ? "dash-clicked" : ""}`} onClick={()=>{setClicked("logout"); props.menuItem("logout")}}>
                    <LogOut color='red'/>
                    <p>Log out</p>
                </div>
                {/* <div></div>
                <div></div> */}
            </div>
        </div>
        </>
    )
}
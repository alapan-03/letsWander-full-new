import { useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { useEffect, useState, createContext, useContext } from 'react';
import clock from "./../Assets/clock-2 (1).png"
import calender from "./../Assets/calendar-days (2).png"
import people from "./../Assets/users.png"
import dollar from "./../Assets/dollar-sign.png"
import Footer from "./Footer"
import URL from "./rootUrl"
import Navbar from "./Navbar"
import Stripe from './Stripe';
// import URL from "./rootUrl"


export default function BookSummary(props) {

    const cookies = new Cookies();

    const { dataId2 } = useParams();

    // cookies.set("tourId", dataId);
    
    // console.log(dataId)
    
    let token = cookies.get("token")
    const stringWithoutQuotes = token.replace(/"/g, "");

    // console.log(stringWithoutQuotes)

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  

    // console.log(dataId)
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${URL}/api/v1/details/${dataId2}/getAllDetails`,
           {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${stringWithoutQuotes}`, // Include the token in the Authorization header
            }
        }
        );
        ; // Replace with your API endpoint
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
  
          const result = await response.json();
        //   console.log(result)
          setData(result);
          setLoading(false);
        } catch (error) {
          setError(error);
          setLoading(false);
        }
      };
  
      fetchData();
    }, []); // Empty dependency array ensures the effect runs once when the component mounts
  
    if (loading) {
      return <p>Loading...</p>;
    }




    const addToBook = async () => {
      try {
        const response = await fetch(`${URL}/api/v1/users/${dataId2}/addToBook`,
        {
         method: 'PATCH',
         headers: {
             Authorization: `Bearer ${stringWithoutQuotes}`, 
         }
     });
     
     if(response.ok){
     let res = await response.json()

     console.log(res)
     console.log("dklfdfmkdmk")
     }

        
    //  window.location.reload()
     if (!response.ok) {
          throw new Error('Network response was not ok');

    
        }
        else{
            // forceUpdate()
        }

        // const result = await response.json();
      } catch (error) {
        // setError(error);
        setLoading(false);
      }
    };

    
    data && console.log(data)


    let dateString = data?.doc?.startDate;
    const dateObject = new Date(dateString);
    const formattedDate = dateObject.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });


    return (
        <>
            <div className="summary-outer">

              <Navbar/>

                <div className="summary">
              <h1 className='success'>{data ? `Tour successfully booked. Thank you for choosing us.` : "Booking failed"}</h1>

                  <div className='summary-inner'>
                    <div className='summary-i1'>
                        <div className='summary-i1-i1'>
                            <div><img className='summary-img1' src={data?.doc?.tour.image}/></div>
                            <div></div>
                        </div>
                        <div className='summary-i1-i2'>
                          <p className='summary-p1'>Package Detail</p>
                          <p className='summary-p2'>Enjoy {data?.doc?.tour.name} 😍</p>
                          
                          <div>
                            <img className='summary-icons' src={clock}></img>
                            <p>{data?.doc?.tour.duration} days</p>
                          </div>

                          <div>
                            <img className='summary-icons' src={people}/>
                            <p>{data?.doc?.totalAdults+data?.doc?.totalChild} persons</p>
                          </div>

                          <div>
                            <img className='summary-icons' src={calender}/>
                            <p>{formattedDate}</p>
                          </div>
                        </div>
                    </div>

                    <div className='summary-2nd'><br/>
                      <div className='summary-incl'><br/>
                        Inclusions (5 out of Many):<br/>
                        {data?.doc?.tour.inclusions.map((item, idx)=>(
                          idx < 5 &&
                          <p>✅ {item}</p>
                        ))}
                      </div>

                      <div className='summary-excl'>
                      
                        <br/>Exclusions: (5 out of Few)<br/>
                        {data?.doc?.tour.exclusions.map((item, idx)=>(
                          idx < 5 &&
                          <p>❌ {item}</p>
                        ))}
                      </div>


                    </div>
              </div>

<div className='summary-i2-outer'>
                    <div className='summary-i2'>
                      <div className='summary-i2-i1'>
                        <img className='summary-rupee-img' src={dollar}/>
                        <p>Price Details</p>
                      </div>
                      <hr></hr>

                      <div className='summary-price'>
                        <p>Adult x {data?.doc?.totalAdults}</p>
                        {/* <p>{data?.doc?.totalPrice}</p> */}
                        <p>${data?.doc?.totalAdults*data?.doc?.tour.price}</p>
                      </div>

                      <div className='summary-price'>
                        <p>Child x {data?.doc?.totalChild}</p>
                        {/* <p>{data?.doc?.totalPrice}</p> */}
                        <p>${((data?.doc?.totalChild*data?.doc?.tour.price)/2)}</p>
                      </div>

                      <div className='summary-price'>
                        <p>Tax</p>
                        <p>${(data?.doc?.tour.price * (6/100)).toFixed(2)}</p>
                      </div>
                      <hr></hr>


                      <div className='summary-price summary-price-3'>
                        <p>Total</p>
                        <p>${data?.doc?.totalAdults*data?.doc?.tour.price + ((data?.doc?.totalChild*data?.doc?.tour.price)/2) + data?.doc?.tour.price * (6/100)}</p>
                      </div>

                    </div>
                      {/* <button className='summary-book' onClick={()=> addToBook()}>Book Now</button> */}
                      </div>
                </div>
            </div>

            <Footer/>

            <Stripe/>
        </>
    )
}
import React, { useState, useEffect, useReducer } from 'react';
import Cookies from 'universal-cookie';
import del from "./../Assets/trash-2.png"
import URL from "./rootUrl"


export default function Me(props) {

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const cookies = new Cookies();
    
    let token = cookies.get("token")
    const stringWithoutQuotes = token.replace(/"/g, "");


  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInfo, setIsInfo] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${URL}/api/v1/users/me`,
        {
         method: 'GET',
         headers: {
             Authorization: `Bearer ${stringWithoutQuotes}`, 
         }
     });
     
     if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        // setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs once when the component mounts

  if (loading) {
    return <p>Loading...</p>;

}
  
    const deleteData = async (id) => {
      try {
        const response = await fetch(`${URL}/api/v1/users/cancelBooking/${id}`,
        {
         method: 'DELETE',
         headers: {
             Authorization: `Bearer ${stringWithoutQuotes}`, 
         }
     });
     

        
     window.location.reload()
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




// }

console.log(data)

    return (
        <>

        <div className='me-outer'>
            <p className='me-title'>All about me</p>
            <div className='me-inner'>

                <div className='me-i1'>
                    <p className='me-info-p' 
                    >Basic Info</p>
                    
                    <p className='me-booked-p' 
                    >Booked Tours</p>
                </div>
                <hr/>

                <div className='me-cont'>
                {data && 
                        <div>
                            <p>Name - {data?.me.name}</p>
                            <p>Email - {data?.me.email}</p>
                            <p>Role - {data?.me.role}</p>
                        </div> 
                    }
                        <div className='me-cont-i2'>
                            {
                                data && data.me.tour.length>0 ? data.me.tour.map(tours => (
                                    <div className='me-booked'>
                                        <img className='me-img' src={tours?.image}/> 
                                        <p key={tours?.id}>{tours?.name}</p> <br></br>   
                                        <p>${tours?.price}</p>
                                        <img className='me-del' onClick={() => deleteData(tours?._id)} src={del}/>
                                    </div>
                                    )) : (
                                        <p className='me-empty'>Your Booked Tours Here</p>
                                    )
                            }
                        </div>
                     
                </div>

            </div>
        </div>

        </>
    )
}
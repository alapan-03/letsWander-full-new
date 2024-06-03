import { useEffect, useState } from "react";
import Cookies from 'universal-cookie';
import cross from "./../Assets/cross.png"
import { Link, useParams } from 'react-router-dom';
import URL from "./rootUrl"


export default function AdditionalDetails(props) {

  const cookies = new Cookies();

  let tourId = cookies.get("tourId")
  // console.log(tourId)
  
  // const [isBook, setIsBook] = useState(false)

  // setIsBook(props.isBooked)
  
  // useEffect(()=>{
  //   let details = document.getElementsByClassName("details-cont")[0];

  //   if(props.isBooked){
  //     details.style.display = "block"
  //   }
  //   else{
  //     details.style.display = "none"
  //   }
  // },[])

  // console.log(props.data)

  let token = cookies.get("token")
    const stringWithoutQuotes = token.replace(/"/g, "");

    const [postData, setPostData] = useState({
        title:"a",
        startDate: new Date(),
        totalAdults: 1,
        totalChild: 0,
      });
    
      // const handleInputChange = (event) => {
      //   const { name, value } = event.target;
      //   setFormData({
      //     ...formData,
      //     [name]: name === 'date' ? new Date(value).toISOString().split("T")[0] : parseInt(value, 10),
      //   });
      // };
    

      const handleInputChange = (e) => {
        setPostData({
          ...postData,
          startDate: e.target.value
        });
      };

      const handleInputChange2 = (e) => {
        setPostData({
          ...postData,
          [e.target.name]: e.target.value
        });
      };

      const handleInputChange3 = (e) => {
        setPostData({
          ...postData,
          [e.target.name]: e.target.value
        });
      };
      
      const handlePostData = async () => {
        try {
          const response = await fetch(`${URL}/api/v1/details/${tourId}/addDetails`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${stringWithoutQuotes}`,
            },
            body: JSON.stringify(postData),
          });
    
          if (response.ok) {
            const res = await response.json();
            console.log('Data successfully posted!', res);
          } else {
            console.error('Failed to post data:', response.status);
          }
        } catch (error) {
          console.error('Error posting data:', error);
        }
      };

    return(
        <>
        <div className="details-cont">
          <div>
            <img className="detail-img" src={props.data.image}/>
          </div>


            <div className="details-inner">
                <h2>More information please!</h2>
                <label htmlFor="dateInput">Select Date: &nbsp;</label>
                <input
                    type="date"
                    id="dateInput"
                    name="date"
                    // value={formData.startDate.toISOString().split('T')[0]}
                    value={postData.startDate}
                    onChange={handleInputChange}
                />
                <br />

                <div>
                  <div>
                    <label htmlFor="personsInput">Adults: &nbsp;</label>
                    <input
                        type="number"
                        id="personsInput"
                        name="totalAdults"
                        value={postData.totalAdults}
                        onChange={handleInputChange2}
                        min="1"
                        max="8"
                    />
                    <br />
                  </div>

                  <div className="itemmm2">
                    <label htmlFor="childrenInput">Children: &nbsp;</label>
                    <input
                        type="number"
                        id="childrenInput"
                        name="totalChild"
                        value={postData.totalChild}
                        onChange={handleInputChange3}
                        min="0"
                        max="8"
                    />
                  </div>
                </div>
                <br />
                <Link to={`/${tourId}/summary`}><button onClick={handlePostData}>Continue</button></Link>
            </div>
            </div>
            <img className="cross" src={cross}/>
        </>
    )
}
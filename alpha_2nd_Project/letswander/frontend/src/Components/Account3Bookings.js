import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import url from "./rootUrl";
import { MessageCircle, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { addItem } from "./../redux/slices/cartSlice";
import { Link } from "react-router-dom";

export default function Account3Bookings(props) {
  const dispatch = useDispatch();
  const cookie = new Cookies();
  const token = cookie.get("token");
  const stringWithoutQuotes = token && token.replace(/"/g, "");

  const [me, setMe] = useState(null);

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
        } else {
          console.error("Failed to fetch data", response.statusText);
        }
      } catch (err) {
        console.error("Error making GET request:", err.message);
      }
    };

    fetchMe();
  }, [stringWithoutQuotes]);

  return (
    <>
      <div className="bookings">
        {me &&
          me?.tour.map((el) => (
            <div className="book-cont" key={el?.id}>
              <img className="book-img" src={el?.image} alt={el?.name} />
              <div className="book-info">
                <p className="book-name">{el?.name}</p>
                <p className="book-price">${el?.price}</p>
              </div>
              <div className="book-actions">
                <Link to={"/chat"}>
                  <MessageCircle
                    onClick={(e) =>
                      dispatch(
                        addItem({ name: el.name, id: el._id, image: el?.image })
                      )
                    }
                    color="gray"
                  />
                </Link>
                <Trash2 color="red" />
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

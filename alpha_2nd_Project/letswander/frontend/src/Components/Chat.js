import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Cookies from "universal-cookie";
import url from "./rootUrl";
import { useSelector } from "react-redux";
import { MapPin, Send } from "lucide-react";
import { useRef } from "react";
import { MessageBox } from "react-chat-elements";
import Navbar from "./Navbar";

const socket = io("https://letswander-full-new.onrender.com"); // Create socket connection outside the component

export default function Chat(props) {
  const cookie = new Cookies();
  const token = cookie.get("token");
  const stringWithoutQuotes = token && token.replace(/"/g, "");

  // const [tourId, setTourId] = useState("");
  // const [chatRoom, setChatRoom] = useState(null)
  const [me, setMe] = useState(null);
  const [message, setMessage] = useState("");
  const [messageBack, setMessageBack] = useState([]);
  // const [isRed, setIsRed] = useState("red");
  const [currentTourId, setCurrentTourId] = useState();
  const [messages, setMessages] = useState([]);
  const [postMessages, setPostMessages] = useState(null);
  const joinedRooms = new Set(); // Set to track joined rooms
  const [dispMsg, setDispMsg] = useState("");
  const [chats, setChats] = useState([]);
  const [previousTourId, setPreviousTourId] = useState(null);
  const [clicked, setClicked] = useState(null);
  const [tour, setTour] = useState(null);

  const items = useSelector((state) => state);
  // console.log(items);

  // create chat
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await fetch(
          `${url}/api/v1/chat/createChat/${items?.cart[0].id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${stringWithoutQuotes}`,
            },
            body: JSON.stringify({ tourId: items?.cart.id }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          // console.log(result)
          setChats(result.data);
          // setMe(result?.user);
        }
        // else {
        //     console.error('Failed to fetch data', response.statusText);
        // }
      } catch (err) {
        console.error("Error making GET request:", err.message);
      }
    };

    fetchMe();
  }, [stringWithoutQuotes]);

  // fetch all messages bases on tourId on req.params.tourId

  const fetchMessages = async (tourId) => {
    // console.log(message)
    try {
      const response = await fetch(
        `${url}/api/v1/message/getMessages/${tourId}`,
        {
          headers: {
            Authorization: "Bearer " + stringWithoutQuotes,
          },
        }
      );

      if (response.ok) {
        let res = await response.json();
        // console.log(res)
        setPostMessages(res.message);
      } else {
        console.error("Error fetching messages");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  console.log(messageBack);

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
  // console.log(me);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageBack]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket.io connected with ID:", socket.id);

      socket.emit("setup", me);
    });
    // console.log("clicked2",currentTourId)

    socket.on("emitFromBackend", (data) => {
      console.log("senderId  :   ", data.senderId, "meId  ", me._id);
      console.log(currentTourId);
      console.log("Received message from backend:", data.message);
      setMessageBack((prevMessages) => {
        if (data.chatId === currentTourId) {
          return [
            ...prevMessages,
            {
              message: data.message,
              chatId: data.chatId,
              senderId: data.senderId,
            },
          ];
        }
        return prevMessages; // Return the existing messages unchanged if the chatId doesn't match
      });
    });

    return () => {
      socket.off("connect");
      socket.off("emitFromBackend");
    };
  }, [currentTourId]);

  useEffect(() => {
    // if (currentTourId && !joinedRooms.has(currentTourId)) {

    // setMessageBack([])
    if (previousTourId) {
      socket.emit("leaveChat", previousTourId);
      console.log(`Emitted leaveChat with tourId: ${previousTourId}`);
    }

    if (currentTourId) {
      socket.emit("joinChat", currentTourId);
      console.log(`Emitted joinChat with tourId: ${currentTourId}`);
    }

    setPreviousTourId(currentTourId);
  }, [currentTourId, joinedRooms]);

  const sendMessage = () => {
    socket.emit("sendMessage", {
      chatId: currentTourId,
      message: message,
      senderId: me?._id,
    });

    const postMessage = async () => {
      // console.log(message)
      console.log("Current Tour ID:", currentTourId);

      if (!currentTourId) {
        console.error("No tour ID provided");
        return;
      }

      try {
        const response = await fetch(
          `${url}/api/v1/message/createMessages/${currentTourId.trim()}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${stringWithoutQuotes}`,
            },
            body: JSON.stringify({ message: message }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          // console.log("Result:", result);

          // Assuming result contains a user object
          if (result?.user) {
            setMe(result.user);
          } else {
            console.log("User object not found in response");
          }
        } else {
          console.error("Failed to post message:", response.statusText);
        }
      } catch (err) {
        console.error("Error making POST request:", err.message);
      }
    };

    // Call postMessage where appropriate
    postMessage();

    setMessages([...messages, { message: message, sender: me }]);
    setMessage("");
  };

  const uniqueChats = me?.chatJoined?.reduce((acc, current) => {
    const x = acc.find((item) => item.id === current.id);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  const fetchTour = async (dataId) => {
    try {
      const response = await fetch(`${url}/api/v1/tours/${dataId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${stringWithoutQuotes}`, // Include the token in the Authorization header
        },
      });
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setTour(result.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="chat">
        <div className="chat-names">
          {uniqueChats &&
            uniqueChats.map((el) => (
              <div
                className={`chat-item-cont ${
                  clicked === el?.name ? "dash-clicked" : ""
                }`}
                key={el.id}
                onClick={() => {
                  setCurrentTourId(el?.id);
                  fetchMessages(el?.id);
                  setClicked(el?.name);
                  fetchTour(el.id);
                }}
              >
                <img className="chat-img" src={el?.image} alt="Chat" />
                {/* <div> */}
                <p
                  key={el?._id}
                  className="chat-names-tour"
                  onClick={() => {
                    setCurrentTourId(el?.id);
                  }}
                >
                  {el?.name}
                </p>
                {/* <p className="chat-last-msg">{lastMsg ? lastMsg.message : lastMsgPost ? lastMsgPost.message: ""}</p> */}
                {/* </div> */}
              </div>
            ))}
        </div>

        <div className="chat-messages">
          <div className="only-chat-messages">
            {postMessages &&
              postMessages?.map((el, index) => (
                <div
                  key={index}
                  className={`${
                    el?.senderId._id === me?.id ? "rightChat" : "leftChat"
                  }`}
                >
                  <p>
                    <p className="sender-name-orange">
                      {el?.senderId._id === me?.id
                        ? ""
                        : el?.senderId?.name?.split(" ")[0] + ": "}
                    </p>
                    {el?.message}
                  </p>
                </div>
              ))}

            {messageBack
              .filter((msg) => msg?.chatId === currentTourId)
              .map((msg, index) => (
                <div
                  key={index}
                  className={msg.senderId !== me.id ? "leftChat" : "rightChat"}
                >
                  <p>
                    {msg.senderId !== me.id
                      ? <p className="sender-name-orange">{msg?.senderId?.name?.split(" ")[0]}</p>
                      : ""}{" "}
                    {msg?.message}
                  </p>
                </div>
              ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-inp-send">
            <input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="socket-input"
            />
            <button className="chat-send-btn" onClick={sendMessage}>
              <Send color="white" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {tour && (
          <div className="chat-info">
            <div className="chat-info-tour-info">
              <img className="chat-info-img" src={tour && tour?.image} />
              <div>
                <p className="chat-info-p1">{tour && tour.name}</p>
                <p className="chat-info-p3">{tour && tour.theme}</p>
              </div>
            </div>
            <div className="chat-info-description">
              <p className="chat-info-p2">Description</p>
              <p>
                {tour &&
                  tour?.overview?.split(". ")[0] +
                    ". " +
                    tour?.overview?.split(". ")[1] +
                    "."}
              </p>
            </div>

            {tour.admin && tour.guides && (
              <div className="chat-info-guides-admin">
                <p className="chat-info-p2">Members</p>
                <div className="guides-admin">
                  {tour?.admin?.photo ? (
                    <img className="chat-info-img" src={tour?.admin?.photo} />
                  ) : (
                    <p className="admin-name">
                      {tour?.admin?.name.substr(0, 1)}
                    </p>
                  )}
                  <div>
                    <p className="chat-info-names">
                      {tour?.admin?.name && tour?.admin?.name}
                    </p>
                    <p className="chat-info-roles">{tour?.admin?.role}</p>
                  </div>
                </div>

                <div className="guides-admin">
                  {tour?.guides[0]?.photo ? (
                    <img
                      className="chat-info-img"
                      src={tour?.guides[0]?.photo}
                    />
                  ) : (
                    <p className="admin-name">
                      {tour?.guides[0]?.name.substr(0, 1)}
                    </p>
                  )}
                  <div>
                    <p className="chat-info-names">
                      {tour?.guides[0]?.name && tour?.guides[0]?.name}
                    </p>
                    <p className="chat-info-roles">{tour?.guides[0]?.role}</p>
                  </div>
                </div>

                <div className="guides-admin">
                  {tour?.guides[1]?.photo ? (
                    <img
                      className="chat-info-img"
                      src={tour?.guides[1]?.photo}
                    />
                  ) : (
                    <p className="admin-name">
                      {tour?.guides[1]?.name.substr(0, 1)}
                    </p>
                  )}
                  <div>
                    <p className="chat-info-names">
                      {tour?.guides[1]?.name && tour?.guides[1]?.name}
                    </p>
                    <p className="chat-info-roles">{tour?.guides[1]?.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

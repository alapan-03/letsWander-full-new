import { Loader, Pencil, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import url from "./rootUrl";
import { useDispatch } from "react-redux";
import { addItem } from "./../redux/slices/cartSlice";
import CustomToast from "./CustomToast";

export default function Account2(props) {
  const cookies = new Cookies();
  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userPhoto, setUserPhoto] = useState();
  const [me, setMe] = useState({ name: "", lastName: "", email: "" });
  const [clickedUpload, setClickedUpload] = useState(false);
  const [uploadPhoto, setUploadPhoto] = useState(false);
  const [showToastError, setToastError] = useState("");
  const [showToastSuccess, setToastSuccess] = useState(null);

  let token = cookies.get("token");
  const dispatch = useDispatch();

  const stringWithoutQuotes = token && token.replace(/"/g, "");
  console.log(stringWithoutQuotes);

  uploadPhoto && dispatch(addItem({ photo: uploadPhoto }));
  const handleUpload = () => {
    setClickedUpload(true);
    if (image) {
      uploadImage(image);
    }
  };

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await fetch(`${url}/api/v1/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${stringWithoutQuotes}`,
          },
        });

        console.log(response);

        if (response.ok) {
          const result = await response.json();
          console.log(result);

          setUserPhoto(result?.user?.photo);
          setMe(result?.user);
        } else {
          console.error("Failed to fetch data", response.statusText);
        }
      } catch (err) {
        console.error("Error making GET request:", err.message);
      }
    };

    fetchMe();
  }, []); // You may need to add dependencies here

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${url}/api/v1/users/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stringWithoutQuotes}`,
        },
        body: formData,
      });

      console.log(response);

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setIsPopupOpen(false);
        setClickedUpload(false);
        setUploadPhoto(result?.url);
        setToastSuccess("Upload successful!");
        setTimeout(() => {
          // window.location.reload();
        }, 2000);
      } else {
        console.error("Failed to fetch data", response.statusText);
        setToastError("Upload failed!");
      }
    } catch (err) {
      console.error("Error making GET request:", err.message);
      setToastError("Error while uploading!");
    }
  };

  // console.log(userPhoto)
  // console.log(uploadPhoto)

  const handleUpdate = async () => {
    try {
      // const fullName = `${me.name} ${me.lastName}`.trim();
      const response = await fetch(`${url}/api/v1/users/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${stringWithoutQuotes}`,
        },
        body: JSON.stringify(me),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Update successful:", result);
        props.updated(true);
        setToastSuccess("Successfully updated!");
        localStorage.removeItem("hasShownToastUpdate");
      } else {
        console.error("Failed to update data", response.statusText);
        setToastError("Error while updating!");
        // localStorage.removeItem("hasShownToastUpdateError")
      }
    } catch (err) {
      console.error("Error making PUT request:", err.message);
      setToastError("Error while updating!");
      // localStorage.removeItem("hasShownToastUpdateError")
    }
  };

  const editPhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setIsPopupOpen(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMe((prevMe) => ({
      ...prevMe,
      [name]: value,
    }));
  };

  const popupStyles = {
    width: "400px",
    height: "500px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    // gap: "1rem"
  };

  //   console.log(me.name)

  return (
    <>
      {showToastError && (
        <CustomToast message={showToastError} isError={true} />
      )}
      {showToastSuccess && (
        <CustomToast message={showToastSuccess} isError={false} />
      )}
      <div className="dash2-cont">
        {image && isPopupOpen && (
          <Popup
            className="pfp-prev-cont"
            open={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            position="right center"
            contentStyle={popupStyles}
          >
            <div className="pfp-prev">
              <img
                className="preview-pic"
                src={URL.createObjectURL(image)}
                alt="Profile Preview"
              />
            </div>

            <button className="dash-update-btn" onClick={handleUpload}>
              {clickedUpload ? <Loader /> : "Upload"}
            </button>
          </Popup>
        )}
        <div className="dashboard2">
          <div className="dash2-i1">
            <div className="dash2-account">
              <div>
                <p className="dash2-title1">Account Details</p>
                <p className="dash2-title1-1">Manage your passport profile</p>
              </div>
              <hr />

              <div className="dash2-photo-cont">
                {uploadPhoto ? (
                  <img
                    className="profile-photo"
                    src={uploadPhoto}
                    alt="Profile"
                  />
                ) : userPhoto ? (
                  <img
                    className="profile-photo"
                    src={userPhoto}
                    alt="Profile"
                  />
                ) : cookies.get("photo") ? (
                  <img
                    className="profile-photo"
                    src={cookies.get("photo")}
                    alt="Profile"
                  />
                ) : (
                  <p className="profile-photo-nodata">
                    <UserRound />
                  </p>
                )}
                <p>Profile picture</p>
                <input
                  onChange={handleImageChange}
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }} // Hide the file input
                />
                <p className="pfp-hover" onClick={editPhoto}>
                  <Pencil size={18} />
                </p>
              </div>

              <div className="dash2-inputs">
                <div className="dash2-name">
                  <div>
                    <p>Name</p>
                    <input
                      name="name"
                      value={me?.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  {/* <div>
                  <p>Last Name</p>
                  <input name="lastName"
                    value={me.lastName}
                    onChange={handleInputChange}/>
                </div> */}
                </div>

                <div>
                  <p>Email address</p>
                  <input
                    disabled={true}
                    className="dash2-email-inp"
                    name="email"
                    value={me?.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <button className="dash-update-btn" onClick={handleUpdate}>
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

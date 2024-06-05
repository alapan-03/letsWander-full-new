import { useEffect, useState } from "react";
import cookie from "js-cookie";
import Cookies from "universal-cookie";
import { Link, useNavigate } from "react-router-dom";
import URL from "./rootUrl";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { Formik } from "formik";
import { useFormik } from "formik";
import { signUpSchema } from "./Schema/loginSchema";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomToast from "./CustomToast";

const firebaseConfig = {
  apiKey: "AIzaSyD94aJZKNp1dzOjRyD3cMtLxcHzSyaWE5U",
  authDomain: "letswander-6110c.firebaseapp.com",
  projectId: "letswander-6110c",
  storageBucket: "letswander-6110c.appspot.com",
  messagingSenderId: "745673402765",
  appId: "1:745673402765:web:a103e63d0e25a86311b5c4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Login(props) {
  const customId = "custom-id-yes";
  let navigate = useNavigate();
  let cookie = new Cookies();

  const [googleData, setGoogleData] = useState({
    email: "",
    password: "",
  });
  const [result, setResult] = useState(null);
  const [username, setUsername] = useState(null);
  const [token, setToken] = useState(null);
  const [postData, setPostData] = useState({
    email: "",
    password: "",
  });
  const [showSignOutToastError, setShowSignOutToastError] = useState(false);
  const [showToastError, setToastError] = useState("");
  const [showToastSuccess, setToastSuccess] = useState(null);

  const loginGoogle = async () => {
    try {
      // Initialize universal cookie instance
      const cookies = new Cookies();

      // Start Google sign-in process\
      // console.log("hey auth")
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      console.log(result);

      if (result) {
        const user = result.user;
        const token = await user.getIdToken();
        console.log(token);
        // Extract user info
        const displayName = user.displayName;
        const email = user.email;
        const photoUrl = user.photoURL;

        // Log the user details
        console.log("Email:", email);
        console.log("Display Name:", displayName);
        console.log("Photo URL:", photoUrl);

        // Prepare user data
        const userData = {
          name: displayName,
          email: email,
        };

        // Set user data in state
        setGoogleData(userData);

        // Perform login request to the server
        const loginSuccess = await handleLogInRequest(userData);

        if (loginSuccess) {
          console.log("token sets here");
          if (token) {
            // Set token and photo URL in cookies using universal-cookie
            cookies.set("token", token, { path: "/" });
            cookies.set("photo", photoUrl, { path: "/" });
            navigate("/");
          } else {
            console.error("Token is undefined");
            setToastError("Login failed!");
          }
        } else {
          console.error("Login request failed");
        }
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setToastError("Error signing in with Google");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user
          .getIdToken()
          .then((token) => {})
          .catch((error) => {
            console.error("Error getting ID token:", error);
          });
      } else {
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogInRequest = async (userData) => {
    try {
      const response = await fetch(`${URL}/api/v1/users/loginGoogle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      console.log(result);

      if (result.status === "fail") return false;

      return true;

      // return result?.status !== "fail";
    } catch (err) {
      console.error("Error making POST request:", err.message);
      return false;
    }
  };

  const handlePostRequest = async (data) => {
    try {
      // Make the POST request
      const response = await fetch(`${URL}/api/v1/users/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Check if the response is not ok and throw an error if it isn't
      if (!response.ok) {
        setToastError("Problem");
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      // Parse the JSON response
      const result = await response.json();
      // localStorage.removeItem("hasShownToast");

      // Log the result
      console.log(result);

      // Set the token and result state
      setToken(result.token);
      setResult(result);

      cookie.set("token", result.token, { path: "/" });
      cookie.set("username", result.name, { path: "/" });
      setUsername(result.name);

      window.location.href = "/";
    } catch (error) {
      // Log any errors
      console.error("Error making POST request:", error);
    }
  };

  useEffect(() => {
    if (showToastError) {
      const timer = setTimeout(() => {
        setToastError("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showToastError]);

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  };

  // const Registration = () => {
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: signUpSchema,
      onSubmit: (values, action) => {
        console.log(
          "🚀 ~ file: Registration.jsx ~ line 11 ~ Registration ~ values",
          values
        );
        handlePostRequest(values);
        action.resetForm();
      },
    });
  console.log(
    "🚀 ~ file: Registration.jsx ~ line 25 ~ Registration ~ errors",
    errors
  );

  console.log(showToastError);
  // }

  return (
    <>
      <div className="login">
        {showToastError && (
          <CustomToast message={showToastError} isError={true} />
        )}

        <div className="login-cont">
          <p>PASSPORT</p>
          <p>Please login to get full access</p>

          <form onSubmit={handleSubmit} className="login-cont2">
            <div className="input-block"></div>
            <div className="input-block">
              <div className="input-container">
                <input
                  type="email"
                  autoComplete="off"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.email && touched.email ? (
                  <p className="form-error">{errors.email}</p>
                ) : null}
              </div>
            </div>
            <div className="input-block">
              <div className="input-container">
                <input
                  type="password"
                  autoComplete="off"
                  name="password"
                  id="password"
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.password && touched.password ? (
                  <p className="form-error">{errors.password}</p>
                ) : null}
              </div>
            </div>
            <div className="input-block"></div>
            <div className="modal-buttons">
              <button
                className="input-button signup-submit"
                type="submit"
                onClick={handlePostRequest}
              >
                Submit
              </button>
            </div>
            <p className="already">
              New to PASSPORT?{" "}
              <Link to="/signup">
                <span className="redirect">SignUp</span>
              </Link>
            </p>
          </form>

          <button className="button" onClick={loginGoogle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid"
              viewBox="0 0 256 262"
            >
              <path
                fill="#4285F4"
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
              ></path>
              <path
                fill="#34A853"
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
              ></path>
              <path
                fill="#FBBC05"
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
              ></path>
              <path
                fill="#EB4335"
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
              ></path>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </>
  );
}

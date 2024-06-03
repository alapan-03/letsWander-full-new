import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import { Link, useNavigate } from "react-router-dom";
import URL from "./rootUrl";
import { useFormik } from "formik";
import { signUpSchema } from "./Schema/index";
import { initializeApp } from "firebase/app";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

// Your web app's Firebase configuration
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

export default function Signup(props) {
  let navigate = useNavigate();
  let cookie = new Cookies();

  const [result, setResult] = useState(null);
  const [token, setToken] = useState(null);
  const [googleData, setGoogleData] = useState();

  const loginGoogle = async () => {
    try {
      const cookies = new Cookies();
      const result = await signInWithPopup(auth, new GoogleAuthProvider());

      if (result) {
        const user = result.user;
        const token = await user.getIdToken();
        const displayName = user.displayName;
        const email = user.email;
        const photoUrl = user.photoURL;

        console.log("Email:", email);
        console.log("Display Name:", displayName);
        console.log("Photo URL:", photoUrl);

        const googleData = {
          name: displayName,
          email: email,
          id: result,
        };

        setGoogleData(googleData);

        console.log("Sign-in result:", result);
        console.log("Token:", token);

        cookies.set("token", token, { path: "*" });
        cookies.set("photo", photoUrl, { path: "*" });
        localStorage.setItem("token", token);
        localStorage.removeItem("notificationShown");

        const signUpSuccess = await handleSignUpRequest(googleData);

        localStorage.removeItem("hasShownToastSignUp");
        
        if (signUpSuccess) {
          //
          setTimeout(() => {
            navigate("/")
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user
          .getIdToken()
          .then((token) => {
            console.log(token);
            cookie.set("token", token, { path: "*" });
          })
          .catch((error) => {
            console.error("Error getting ID token:", error);
          });
      } else {
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignUpRequest = async (googleData) => {
    try {
      const response = await fetch(`${URL}/api/v1/users/signupGoogle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(googleData),
      });

      const result = await response.json();
      console.log(result);

  //     if (result.token) {
  //       const cookies = new Cookies();
  //       cookies.set("token", result.token, { path: "*" });
  //       setToken(result.token);
  //       return true;
  //     } else {
  //       console.error("Token is undefined in the response");
  //       return false;
  //     }
  //   } catch (error) {
  //     console.error("Error making POST request:", error);
  //     return false;
  //   }
  // };

  if(result.status === "fail")
    toast.error(result.message)

    return result?.status !== "fail";
  } catch (err) {
    console.error("Error making POST request:", err.message);
    return false;
  }
};

  const handlePostRequest = async (data) => {
    try {
      console.log(data);
      const response = await fetch(`${URL}/api/v1/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Handle the response data
      const result = await response.json();
      console.log(result);
      // setToken(result.token)
      if (token) {
        localStorage.removeItem("hasShownToastSignUp");

        setTimeout(() => {
          // navigate('/login')
        }, 1000);
      }

      const cookies = new Cookies();
      cookies.set("token", result.token, { path: "*" });
      setToken(cookies.get("token"));
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

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
          transition={Bounce}
        />
        {/* Same as */}
        <ToastContainer />
      <div className="signup">
        <div className="signup-cont">
          <p className="login-msg">{result?.message}</p>

          <p className="signup-p1">PASSPORT</p>
          <p className="signup-p2">Please signup to get full access</p>
          <form onSubmit={handleSubmit} className="login-cont2">
            <div className="input-block">
              <div className="input-container">
                <input
                  type="name"
                  autoComplete="off"
                  name="name"
                  id="name"
                  placeholder="Name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.name && touched.name ? (
                  <p className="form-error">{errors.name}</p>
                ) : null}
              </div>
            </div>
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
            <div className="input-block">
              <div className="input-container">
                <input
                  type="password"
                  autoComplete="off"
                  name="confirm_password"
                  id="confirm_password"
                  placeholder="Confirm Password"
                  value={values.confirm_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.confirm_password && touched.confirm_password ? (
                  <p className="form-error">{errors.confirm_password}</p>
                ) : null}
              </div>
            </div>
            <div className="modal-buttons">
              <button className="input-button signup-submit" type="submit">
                Submit
              </button>
            </div>
            <p className="already">
              Already have an account?{" "}
              <Link to="/login">
                <span className="redirect">Login</span>
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

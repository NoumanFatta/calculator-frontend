// src/components/Signup.js
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { registerValidationSchema } from "../../helper/validationSchema";
import {
  googleProvider,
  signInWithGooglePopup,
  registerUser,
  db,
} from "../../firebase";
import { useData } from "../../store/DataContext";

import classes from "./style.module.css";
import Swal from "sweetalert2";
import { addDoc, collection } from "firebase/firestore";

const Signup = () => {
  const navigate = useNavigate();
  // redirection logic if user is already authenticated
  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (!!uid) {
      navigate("/cal");
    }
  }, [navigate]);
  const { actions } = useData();

  //google auth
  const handleGoogleLogin = async () => {
    try {
      signInWithGooglePopup(googleProvider)
        .then((res) => {
          Swal.fire({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            icon: "success",
            title: `Welcome ${res?.user?.displayName}`,
          });
          actions.setUserData(res?.user);
          localStorage.setItem("uid", res?.user?.uid);
          res.user
            .getIdToken()
            .then((token) => localStorage.setItem("token", token));
          navigate("/cal");
        })
        .catch((err) => {
          console.error("Google sign-in error:", err);
        });
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  // saving user name in firestore
  const saveDataInFire = async (data) => {
    try {
      const docRef = await addDoc(collection(db, "users"), data);
      console.log("Document successfully written!", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // form validation for authentication logic
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      const { email, password, firstName, lastName } = values;
      await registerUser(email, password)
        .then((userCredential) => {
          const data = {
            displayName: `${firstName} ${lastName}`,
            uid: userCredential?.user?.uid,
          };
          saveDataInFire(data).then((resp) => {
            Swal.fire({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              icon: "success",
              title: `Welcome ${data?.displayName}`,
            });
            actions.setUserData(userCredential?.user);
            localStorage.setItem("uid", userCredential?.user?.uid);
            userCredential.user
              .getIdToken()
              .then((token) => localStorage.setItem("token", token));

            navigate("/cal");
          });
        })
        .catch((error) => {
          const errorrCode = error?.code;
          const errorMessage = error?.message;
          console.log({ errorrCode, errorMessage });
        });
    },
  });

  return (
    <div className={classes["auth-screen"]}>
      <h2>Signup</h2>
      <div className={classes["auth-options"]}>
        <div className={classes["option"]}>
          <button
            className={[classes["google"], classes["auth_button"]].join(" ")}
            onClick={handleGoogleLogin}
          >
            Signup with Google
          </button>
        </div>
        <p className={classes["already-have-acc-text"]}>- OR -</p>
        <form onSubmit={formik.handleSubmit}>
          <div className={classes["option"]}>
            <label>First Name:</label>
            <input
              autoFocus
              type="firstName"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <div className={classes["error"]}>{formik.errors.firstName}</div>
            )}
          </div>
          <div className={classes["option"]}>
            <label>Last Name:</label>
            <input
              type="lastName"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <div className={classes["error"]}>{formik.errors.lastName}</div>
            )}
          </div>
          <div className={classes["option"]}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <div className={classes["error"]}>{formik.errors.email}</div>
            )}
          </div>
          <div className={classes["option"]}>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <div className={classes["error"]}>{formik.errors.password}</div>
            )}
          </div>
          <div className={classes["option"]}>
            <button
              type="submit"
              className={[classes["email"], classes["auth_button"]].join(" ")}
            >
              Signup with Email/Password
            </button>
          </div>
        </form>
        <p className={classes["already-have-acc-text"]}>
          Already Having an account
        </p>
        <div className={classes["option"]}>
          <Link to="/" className={classes["go-to-login"]}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

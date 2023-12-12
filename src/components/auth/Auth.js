// src/components/AuthScreen.js
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { loginValidationSchema } from "../../helper/validationSchema";
import {
  googleProvider,
  signInWithGooglePopup,
  loginUser,
  db,
} from "../../firebase";
import classes from "./style.module.css";
import { useData } from "../../store/DataContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const AuthScreen = () => {
  // redirection logic if user is already authenticated
  const navigate = useNavigate();
  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (!!uid) {
      navigate("/cal");
    }
  }, [navigate]);

  const { actions } = useData();

  // google auth
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

  // form validation for authentication logic
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      const { email, password } = values;
      await loginUser(email, password)
        .then((userCredential) => {
          const q = query(
            collection(db, "users"),
            where("uid", "==", userCredential?.user?.uid)
          );
          onSnapshot(q, (snapshot) => {
            const newData = [];
            snapshot.forEach((doc) => {
              newData.push({ id: doc.id, ...doc.data() });
            });
            Swal.fire({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              icon: "success",
              title: `Welcome ${newData[0]?.displayName}`,
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
      <h2>Login</h2>
      <div className={classes["auth-options"]}>
        <div className={classes["option"]}>
          <button
            className={[classes["google"], classes["auth_button"]].join(" ")}
            onClick={handleGoogleLogin}
          >
            Login with Google
          </button>
        </div>
        <form onSubmit={formik.handleSubmit}>
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
              Login with Email/Password
            </button>
          </div>
        </form>
        <p className={classes["already-have-acc-text"]}>
          Don't have an account?
        </p>
        <div className={classes["option"]}>
          <Link to="/signup" className={classes["go-to-login"]}>
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;

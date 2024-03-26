/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import Button from "../../Button/Button";
import Input from "../../Input/Input";
import styles from "./Login.module.css";
import { useContext, useState } from "react";
import { OrderContext } from "../../store/food-order-context";

export default function Login() {
  const { userCtx, setUserCtx } = useContext(OrderContext);

  const [userData, setUserData] = useState({
    name: "",
    password: "",
    admin: false,
    isLogged: false,
  });

  function getUserDatas(e) {
    const { name, value } = e.target;
    const userValues = { ...userData, [name]: value };
    setUserData(userValues);
  }

  function handleLogin() {
    setUserCtx({
      name: userData.name,
      password: userData.password,
      admin: userData.admin,
      isLogged: true,
    });
    console.log(userCtx);
  }

  return (
    <div>
      {userCtx.isLogged ? (
        <div>
          <h2>Welcome back {userCtx.name}</h2>
          <Link to="/Home">
            <Button>Go to homepage</Button>
          </Link>
        </div>
      ) : (
        <div>
          <h2>Welcome</h2>
          <p>Please login to continue</p>
          <form action="">
            <Input
              onChange={getUserDatas}
              placeholderText={"Enter username"}
              labelText="Username"
              inputName="name"
            />
            <Input
              inputType="password"
              onChange={getUserDatas}
              placeholderText={"Enter password"}
              labelText="Password"
              inputName="password"
            />
            <Input
              onChange={getUserDatas}
              inputType="checkbox"
              labelText="Admin"
              inputName="admin"
            />
          </form>
          <div className={styles.loginModalActions}>
            <Button onClick={handleLogin}>Log in</Button>
          </div>
        </div>
      )}
    </div>
  );
}

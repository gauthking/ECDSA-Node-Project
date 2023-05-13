import React, { useContext, useEffect, useState } from "react";
import axios from "../Axios";
import { toHex } from "ethereum-cryptography/utils.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { AppConfig } from "../context/AppConfig";

function Signin() {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const navigate = useNavigate();
  const [registered, setRegistered] = useState(false);
  const {
    setPublicKey,
    setLogin,
    setLogout,
    user,
    setNotifyStatus,
    publicKey,
    setPrivateKey,
    privateKey,
    setUserName,
    setAccBalance,
    accBalance,
  } = useContext(AppConfig);
  const [lprivateKey, setLPrivateKey] = useState("");

  // const notify = async () =>
  //   toast.success(`User Created - ${publicKey}`, {
  //     position: "top-right",
  //     autoClose: 5000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //     theme: "dark",
  //   });

  const register = async () => {
    if (name !== "" && balance !== "") {
      try {
        const req = await axios.post("/api/createuser", {
          name: name,
          bal: parseInt(balance),
        });
        alert("Posted!");
        const pubKey = new Uint8Array(
          req.data.publicKey.split(",").map(Number)
        );
        const privKey = new Uint8Array(
          req.data.privateKey.split(",").map(Number)
        );
        // console.log(toHex(pubKey));
        setPublicKey(toHex(pubKey));
        setPrivateKey(toHex(privKey));
        setUserName(req.data.userName);
        setAccBalance(balance);
        // console.log(publicKey);
        setLogin();
        setNotifyStatus(`User Logged - ${toHex(pubKey)}`);
      } catch (err) {
        console.log("Error occured while registering - ", err);
      }
    } else {
      alert("Please provide correct inputs");
    }
  };

  const enterApp = async () => {
    if (lprivateKey !== "") {
      try {
        const req = await axios.get("/api/users");
        // console.log(req);
        for (let i = 0; i < req.data.length; i++) {
          const pKey = new Uint8Array(
            req.data[i].privateKey.split(",").map(Number)
          );
          console.log(toHex(pKey));
          if (lprivateKey === toHex(pKey)) {
            setLogin();
            setUserName(req.data[i].userName);
            const pbKey = new Uint8Array(
              req.data[i].publicKey.split(",").map(Number)
            );
            setPublicKey(toHex(pbKey));
            const privKey = new Uint8Array(
              req.data[i].privateKey.split(",").map(Number)
            );
            setPrivateKey(toHex(privKey));
            setAccBalance(req.data[i].balance);
            setNotifyStatus(`User Logged - ${toHex(pbKey)}`);
            alert("Logged In");
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Please provide the input");
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user]);

  return (
    <div className="p-20 border-8 border-blue-500 rounded-xl w-2/4 mt-32">
      <div>
        <ToastContainer />
      </div>
      {!registered ? (
        <div className="flex flex-col gap-10 justify-center items-center">
          <input
            className="px-4 py-2 border-2 border-black rounded-2xl "
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <input
            className="px-4 py-2 border-2 border-black rounded-2xl "
            type="text"
            onChange={(e) => setBalance(e.target.value)}
            value={balance}
            placeholder="Set Initial Balance"
          />
          <div className="flex justify-center items-center gap-10">
            <button
              onClick={() => register()}
              className="font-mono font-semibold text-xl bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-2 active:bg-gradient-to-r active:from-blue-300 active:to-blue-100 hover:scale-105 transition-all ease-in-out"
            >
              Register
            </button>
            <button
              onClick={() => setRegistered(true)}
              className="font-mono font-semibold text-xl bg-gradient-to-r from-blue-200 to-blue-500 rounded-xl p-2 active:bg-gradient-to-r active:from-blue-300 active:to-blue-100 hover:scale-105 transition-all ease-in-out"
            >
              Login
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-12">
          <input
            className="px-4 py-2 border-2 border-black rounded-2xl "
            type="password"
            onChange={(e) => setLPrivateKey(e.target.value)}
            value={lprivateKey}
            placeholder="Paste in your private key"
          />
          <div className="flex justify-center items-center gap-10">
            <button
              onClick={() => enterApp()}
              className="font-mono font-semibold text-xl bg-gradient-to-r from-blue-200 to-blue-500 rounded-xl p-2 active:bg-gradient-to-r active:from-blue-300 active:to-blue-100 hover:scale-105 transition-all ease-in-out"
            >
              Enter
            </button>
            <button
              onClick={() => setRegistered(false)}
              className="font-mono font-semibold text-xl bg-gradient-to-r from-blue-200 to-blue-500 rounded-xl p-2 active:bg-gradient-to-r active:from-blue-300 active:to-blue-100 hover:scale-105 transition-all ease-in-out"
            >
              Register
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signin;

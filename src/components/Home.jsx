import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "../Axios";
import { toHex } from "ethereum-cryptography/utils.js";
import "react-toastify/dist/ReactToastify.css";
import { AppConfig } from "../context/AppConfig";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typewriter from "typewriter-effect";
function Home() {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [verified, setVerified] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(false);
  const [typewriter, setTypewriter] = useState(true);
  const [users, setUsers] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {
    user,
    notifyStatus,
    userName,
    setLogout,
    publicKey,
    privateKey,
    accBalance,
    setAccBalance,
  } = useContext(AppConfig);

  const getUsers = async () => {
    try {
      const req = await axios.get("/users");
      for (let i = 0; i < req.data.length; i++) {
        const pubKey = new Uint8Array(
          req.data[i].publicKey.split(",").map(Number)
        );
        console.log(toHex(pubKey));
      }

      setUsers(req.data);

      console.log(users);
    } catch (error) {
      console.log("An error occured while retrieving the users");
    }
  };

  const updateBalance = async () => {
    try {
      const req = await axios.get("/users");
      for (let i = 0; i < req.data.length; i++) {
        const pKey = new Uint8Array(
          req.data[i].privateKey.split(",").map(Number)
        );
        const pubKey = new Uint8Array(
          req.data[i].publicKey.split(",").map(Number)
        );

        console.log(pubKey);
        if (privateKey === toHex(pKey)) {
          setAccBalance(req.data[i].balance);
          console.log(accBalance);
        }
      }
      getUsers();
    } catch (error) {
      console.log("An error occured while updating the balance");
    }
  };

  const executeTransaction = async (from, to, amount) => {
    if (amount <= accBalance) {
      try {
        const transac = await axios.post("/transaction", {
          from: from,
          to: to,
          amount: amount,
        });
        setTransactionStatus(true);
        // console.log(transac);
        console.log("Transaction complete");
        await updateBalance();
      } catch (error) {
        console.log("Error occured while sending transaction");
      }
    } else {
      handleClose();
      alert("Account Balance is less than the amount to be transferred");
    }
  };

  const handleSignAndVerify = async () => {
    try {
      const msg = `Signing the transfer of ${amount} from ${from} account to ${to} account`;
      const recoveredPublicKey = await axios.post("/verifysignature", {
        msg: msg,
        privateKey: privateKey,
        publicKey: from,
      });
      // console.log(recoveredPublicKey.data);

      if (recoveredPublicKey.data.publicKey === publicKey) {
        setVerified(true);
        console.log("verified");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();

  const notify = async () => {
    toast.success(notifyStatus, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    borderRadius: 4,
    pt: 8,
    px: 14,
    pb: 10,
  };

  const execute = async () => {
    setTransactionStatus(false);
    setVerified(false);
    setLoading(true);
    handleOpen();
    setTimeout(async () => {
      setLoading(false);
      await handleSignAndVerify();
      if (verified) {
        await executeTransaction(from, to, parseInt(amount));
        console.log(transactionStatus);
      }
    }, 5000);
  };

  useEffect(() => {
    getUsers();
    if (user) {
      notify();
    } else {
      navigate("/");
    }
  }, [user]);

  return (
    <div>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <CircularProgress />
                {loading ? "Signing Transaction" : ""}
              </Box>
            ) : (
              ""
            )}
            {verified === true ? (
              <div className="flex flex-col justify-center items-center font-mono font-bold">
                <Typewriter
                  onInit={(typewriter) => {
                    typewriter
                      .typeString(
                        "Signature Hash verified with Sender's Public Key ✅"
                      )
                      .changeDelay(100)
                      .pauseFor(100)
                      .deleteAll()
                      .typeString(
                        `Initiating Transaction of ${amount} tokens from sender to recipient..`
                      )
                      .pauseFor(1000)
                      .deleteAll()
                      .typeString(
                        `${
                          !transactionStatus
                            ? "Transaction Complete ✅"
                            : "Transaction Incomplete ❌"
                        }`
                      )
                      .start();
                  }}
                />
              </div>
            ) : verified === false && !loading ? (
              "Not verified"
            ) : (
              ""
            )}
          </Box>
        </Modal>
      </div>
      <button
        onClick={() => setLogout()}
        className="relative top-6 left-12 px-2 py-1 rounded-xl font-mono active:bg-blue-400 hover:scale-105 transition-all ease-in-out bg-blue-300"
      >
        Logout
      </button>
      <div>
        <ToastContainer />
      </div>
      <p className="text-7xl font-mono font-extrabold m-12 flex">
        Welcome - <p className="text-blue-600 mx-4">{userName}</p>
      </p>
      <div className="transacGrid grid grid-cols-2">
        <div className="border-4 border-black mx-6 rounded-2xl bg-blue-400 flex flex-col p-4 gap-4">
          <p className="font-mono font-extrabold mx-12 text-4xl mb-7">
            Account Information
          </p>
          <div className="flex justify-center items-center">
            <p className="font-mono">Public Key-</p>
            <p className="rounded-lg bg-slate-100 p-1 ml-4">{publicKey}</p>
          </div>
          <div className="flex justify-center items-center">
            <p className="font-mono font-bold">Private Key-</p>
            <p className="rounded-lg bg-slate-100 p-1 ml-4">{privateKey}</p>
          </div>
          <div className="flex justify-center items-center mt-10">
            <p className="font-mono">Current Balance-</p>
            <p className="font-mono mx-2 font-bold"> {accBalance}</p>
          </div>
        </div>
        <div className="border-4 border-black mx-6 rounded-2xl bg-blue-400 flex flex-col p-4">
          <p className="font-mono font-extrabold mx-12 text-4xl mb-7">
            Make a Transaction
          </p>

          <p className="font-mono font-semibold mx-4">From Address:</p>
          <input
            className="px-4 py-2 focus:border-2 border-black rounded-2xl mb-12 "
            type="text"
            placeholder="Enter Address"
            onChange={(e) => setFrom(e.target.value)}
            value={from}
          />

          <p className="font-mono font-semibold mx-4">To Address:</p>
          <input
            className="px-4 py-2 focus:border-2 border-black rounded-2xl "
            type="text"
            placeholder="Enter Address"
            onChange={(e) => setTo(e.target.value)}
            value={to}
          />

          <input
            className="px-4 py-2 mt-12 ml-10 w-1/4 focus:border-2 border-black rounded-2xl "
            type="text"
            placeholder="Enter Amount"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
          />
          <button
            onClick={() => execute()}
            className="px-2 py-1 rounded-xl font-mono active:bg-blue-400 hover:scale-105 transition-all ease-in-out bg-blue-500 w-1/4 mt-4 ml-10"
          >
            Send Amount
          </button>
        </div>
      </div>

      <div className="flex my-14 w-full">
        <div className="transaction w-2/3 mx-6 p-4 bg-blue-300 border-4 border-black  rounded-2xl">
          <p className="font-mono font-extrabold mx-12 text-4xl mb-7">
            Transaction History
          </p>
        </div>
        <div className="accounts w-1/3 mx-3 p-4 bg-blue-300 border-4 border-black  rounded-2xl">
          <p className="font-mono font-extrabold mx-12 text-4xl mb-7">
            Active Accounts
          </p>
          <div className="max-h-96 overflow-y-scroll overflow-x-hidden px-4 ">
            {users.map((user) => (
              <div className="flex flex-col shadow-xl my-2">
                <p className="font-mono font-semibold">{user.userName}</p>
                <p className="font-mono  px-1 py-2 text-xs rounded-xl hover:scale-105 transition-all ease-in-out">
                  {toHex(new Uint8Array(user.publicKey.split(",").map(Number)))}
                </p>
                <p className="font-mono text-sm font-semibold">
                  {user.balance}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

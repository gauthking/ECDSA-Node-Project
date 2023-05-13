import React, { useState, createContext, useEffect } from "react";
export const AppConfig = createContext();


export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(false)
    const [publicKey, setPublicKey] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [notifyStatus, setNotifyStatus] = useState("")
    const [userName, setUserName] = useState("")
    const [accBalance, setAccBalance] = useState("")

    const setLogin = () => {
        setUser(true)
    }

    const setLogout = () => {
        setUser(false)
    }


    useEffect(() => {
        setLogout();
    }, []);
    return (
        <AppConfig.Provider
            value={{
                user,
                setLogin,
                setLogout,
                setPublicKey,
                publicKey,
                setNotifyStatus,
                notifyStatus,
                userName,
                setUserName,
                privateKey,
                setPrivateKey,
                accBalance,
                setAccBalance
            }}
        >
            {children}
        </AppConfig.Provider>
    );
};

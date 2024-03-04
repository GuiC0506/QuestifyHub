import { PropsWithChildren } from "../types/TPropsWithChildren";
import { Component, createContext, createEffect, createSignal, useContext } from "solid-js";
import { api } from "../lib/axios";
import { createStore } from "solid-js/store";

export type TUserContext = {
    _id:string
    country:string
    email:string
}

export const UserContext = createContext({} as TUserContext);

export function UserContextProvider(props) {
    const jwt = localStorage.getItem("token");
    const [userData, setUserData] = createStore();
    /* createEffect(() => { */
    /*     setTimeout(() => { */
    /*         setUserData({email: 1, test: 2}) */
    /*     }, 3000); */
    /* }); */
    createEffect(async () => {
        try {
            const response = await api.get("/users/jwt", {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            setUserData(response.data);
        } catch(err) {
            throw new Error("Error on get user");
        };
    });

    return (
        <UserContext.Provider value={userData}>
            {props.children}
        </UserContext.Provider>
    );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    console.log("useCounterContext: cannot find a CounterContext")
  }
  return context
}
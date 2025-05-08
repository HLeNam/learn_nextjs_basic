"use client";

import {
    createContext,
    // useLayoutEffect,
    useState,
    useContext,
    // useState,
} from "react";

import { clientSessionToken } from "@/lib/http";
import { AccountResType } from "@/schemaValidations/account.schema";

// const AppContext = createContext<{
//     sessionToken: string;
//     setSessionToken: React.Dispatch<React.SetStateAction<string>>;
// }>({
//     sessionToken: "",
//     setSessionToken: () => {},
// });

const AppContext = createContext<{
    user: AccountResType["data"] | null;
    setUser: React.Dispatch<React.SetStateAction<AccountResType["data"] | null>>;
}>({
    user: null,
    setUser: () => {},
});

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};

type User = AccountResType["data"];

export default function AppProvider({
    children,
    initialSessionToken,
    user: userProp,
}: {
    children: React.ReactNode;
    initialSessionToken: string | undefined;
    user: User | null;
}) {
    // const [sessionToken, setSessionToken] = useState<string>(initialSessionToken || "");
    const [user, setUser] = useState<User | null>(userProp || null);

    useState(() => {
        if (typeof window !== "undefined") {
            clientSessionToken.value = initialSessionToken || "";
        }
    });

    // useLayoutEffect(() => {
    //     sessionToken.value = initialSessionToken;
    // }, [initialSessionToken]);

    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

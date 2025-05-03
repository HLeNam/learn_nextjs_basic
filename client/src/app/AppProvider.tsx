"use client";

import {
    createContext,
    // useLayoutEffect,
    useState,
    // useContext,
    // useState,
} from "react";

import { clientSessionToken } from "@/lib/http";

// const AppContext = createContext<{
//     sessionToken: string;
//     setSessionToken: React.Dispatch<React.SetStateAction<string>>;
// }>({
//     sessionToken: "",
//     setSessionToken: () => {},
// });

const AppContext = createContext({});

// export const useAppContext = () => {
//     const context = useContext(AppContext);
//     if (!context) {
//         throw new Error("useAppContext must be used within an AppProvider");
//     }
//     return context;
// };

export default function AppProvider({
    children,
    initialSessionToken,
}: {
    children: React.ReactNode;
    initialSessionToken: string | undefined;
}) {
    // const [sessionToken, setSessionToken] = useState<string>(initialSessionToken || "");

    useState(() => {
        if (typeof window !== "undefined") {
            clientSessionToken.value = initialSessionToken || "";
        }
    });

    // useLayoutEffect(() => {
    //     sessionToken.value = initialSessionToken;
    // }, [initialSessionToken]);

    return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
}

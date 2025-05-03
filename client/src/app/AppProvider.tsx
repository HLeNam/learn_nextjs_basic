"use client";

import { createContext, useContext, useState } from "react";

const AppContext = createContext<{
    sessionToken: string;
    setSessionToken: React.Dispatch<React.SetStateAction<string>>;
}>({
    sessionToken: "",
    setSessionToken: () => {},
});

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};

export default function AppProvider({
    children,
    initialSessionToken,
}: {
    children: React.ReactNode;
    initialSessionToken: string | undefined;
}) {
    const [sessionToken, setSessionToken] = useState<string>(initialSessionToken || "");

    return (
        <AppContext.Provider value={{ sessionToken, setSessionToken }}>
            {children}
        </AppContext.Provider>
    );
}

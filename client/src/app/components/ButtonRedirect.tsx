"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

const ButtonRedirect = () => {
    const router = useRouter();

    const handleNavigateLogin = () => {
        router.push("/login");
    };

    return (
        <Button
            onClick={() => handleNavigateLogin()}
            className="bg-blue-500 text-white hover:bg-blue-600"
        >
            Login
        </Button>
    );
};
export default ButtonRedirect;

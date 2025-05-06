import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import ButtonRedirect from "@/app/components/ButtonRedirect";

const isAuth = true; // Simulating authentication status
export default function Home() {
    // Redirect to login page if not authenticated
    if (!isAuth) {
        redirect("/login");
    }

    return (
        <main className="grid grid-cols-2 gap-4">
            <div className="w-[700px] h-[700px] bg-red-300">
                {/* <Image src="/images/next.svg" alt="Next.js Logo" width={500} height={500} /> */}
                <Image
                    src="https://images.unsplash.com/photo-1568819317551-31051b37f69f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Next.js Logo"
                    width={500}
                    height={500}
                />
            </div>
            <div>
                <ul>
                    <li>
                        <Link href="/login" className="flex items-center gap-2 cursor-pointer">
                            <Button>Login</Button>
                        </Link>
                    </li>
                    <li>
                        <Link href="/register" className="flex items-center gap-2 cursor-pointer">
                            <Button>Register</Button>
                        </Link>
                    </li>
                </ul>
                <div>
                    <ButtonRedirect />
                </div>
            </div>
        </main>
    );
}

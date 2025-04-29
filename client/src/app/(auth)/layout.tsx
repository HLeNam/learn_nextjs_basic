import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <div>
                <Link href="/">
                    <Image
                        src="/images/next.svg"
                        alt="Next.js Logo"
                        width={500}
                        height={500}
                        className={`rounded-full w-[100px] h-[100px] bg-white p-2 
                            shadow-sm shadow-gray-300 
                            hover:shadow-md hover:shadow-gray-400 
                            transition-all duration-200 ease-in-out 
                            cursor-pointer 
                            border-2 border-gray-200 
                            hover:border-gray-300 
                            active:scale-95 active:shadow-sm active:shadow-gray-300 active:border-gray-200`}
                    />
                </Link>
            </div>
            {children}
        </div>
    );
}

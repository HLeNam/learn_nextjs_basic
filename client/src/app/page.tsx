import Image from "next/image";

export default function Home() {
    return (
        <main>
            <div className="w-[700px] h-[700px] bg-red-300">
                {/* <Image src="/images/next.svg" alt="Next.js Logo" width={500} height={500} /> */}
                <Image
                    src="https://images.unsplash.com/photo-1568819317551-31051b37f69f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Next.js Logo"
                    width={500}
                    height={500}
                />
            </div>
        </main>
    );
}

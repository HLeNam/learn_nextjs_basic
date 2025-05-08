import accountApiRequests from "@/apiRequests/account";
import ButtonLogout from "@/components/button-logout";
import { ModeToggle } from "@/components/mode-toggle";
import { cookies } from "next/headers";
import Link from "next/link";

const Header = async () => {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sessionToken")?.value ?? undefined;

    let user = null;
    try {
        if (sessionToken) {
            const data = await accountApiRequests.me(sessionToken);
            user = data.payload.data;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }

    return (
        <div>
            <ul className="flex items-center gap-4">
                <li>
                    <Link href={`/products`}>Sản phẩm</Link>
                </li>
                {user ? (
                    <>
                        <li>
                            <div>
                                Xin chào <strong>{user.name}</strong>
                            </div>
                        </li>
                        <li>
                            <ButtonLogout />
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link href={`/login`}>Đăng nhập</Link>
                        </li>
                        <li>
                            <Link href={`/register`}>Đăng ký</Link>
                        </li>
                    </>
                )}
            </ul>
            <ModeToggle />
        </div>
    );
};
export default Header;

import ButtonLogout from "@/components/button-logout";
import { ModeToggle } from "@/components/mode-toggle";
import { AccountResType } from "@/schemaValidations/account.schema";
import Link from "next/link";

const Header = async ({ user }: { user: AccountResType["data"] | null }) => {
    return (
        <div>
            <ul className="flex items-center gap-4">
                <li>
                    <Link href={`/products`}>Sản phẩm</Link>
                </li>
                {user ? (
                    <>
                        <li>
                            <Link href={`/me`}>
                                Xin chào <strong>{user.name}</strong>
                            </Link>
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
                <li>
                    <ButtonLogout />
                </li>
            </ul>
            <ModeToggle />
        </div>
    );
};
export default Header;

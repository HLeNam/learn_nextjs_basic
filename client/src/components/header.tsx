import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

const Header = () => {
    return (
        <div>
            <ul>
                <li>
                    <Link href={`/login`}>Đăng nhập</Link>
                </li>
                <li>
                    <Link href={`/register`}>Đăng ký</Link>
                </li>
            </ul>
            <ModeToggle />
        </div>
    );
};
export default Header;

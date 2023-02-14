import {Link, useLocation} from "react-router-dom";
import {DarkThemeToggle, Navbar} from "flowbite-react";
import Logo from '../../assets/logo.svg'
import {useSelector} from "react-redux";

export function AppNavbar() {
    const pathname = useLocation().pathname;
    const basePath = "/" + (useSelector((state) => state.auth.userData.role) ?? 'normal');


    return (
        <Navbar>
            <Navbar.Brand href="/">
                <img
                    src={Logo}
                    className="mr-3 h-6 sm:h-9"
                    alt="Logo"
                />
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
      Chat App Admin
    </span>
            </Navbar.Brand>
            <div className="flex md:order-2">
                <DarkThemeToggle/>
                <Navbar.Toggle/>
            </div>
            <Navbar.Collapse>
                <Link to={`${basePath}/`}>
                    <Navbar.Link
                        active={pathname === basePath || pathname === basePath + '/'}
                    >

                        Home
                    </Navbar.Link>
                </Link>
                <Link to={`${basePath}/chats`}>
                    <Navbar.Link
                        active={pathname.includes('chats')}
                    >
                        Chats
                    </Navbar.Link>
                </Link>
                <Link to={`${basePath}/users`}>
                    <Navbar.Link
                        active={pathname.includes('users')}
                    >
                        Users
                    </Navbar.Link>
                </Link>
                <Link to={`${basePath}/profile`}>
                    <Navbar.Link
                        active={pathname.includes('profile')}
                    >
                        Profile
                    </Navbar.Link>

                </Link>
                <Link to={`/logout`}>
                    <Navbar.Link>
                        Logout
                    </Navbar.Link>
                </Link>

            </Navbar.Collapse>
        </Navbar>
    )

}
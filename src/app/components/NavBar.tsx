"use client"
import {useState, useEffect} from "react";
import {LucideIcon, ChevronRight, ChevronLeft, User, ClipboardCheck, FileText, Wrench, Home, X} from "lucide-react";
import {cn} from "@/app/cn";

import styles from "./NavBar.module.css"

export default function Navbar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setIsExpanded(false);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const options: SidebarOptionProps[] = [
        {
            icon: Home,
            title: "Inicio",
            href: "/"
        },
        {
            icon: User,
            title: "Perfil",
            href: "/profile"
        },
        {
            icon: ClipboardCheck,
            title: "Registrar entrada",
            href: "/tasks"
        },
        {
            icon: FileText,
            title: "Lista de registros",
            href: "/settings"
        },
        {
            icon: Wrench ,
            title: "Ordenes de trabajo",
            href: "/logout"
        }
    ];

    return (
        <>
            {isMobile && !isExpanded &&(
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={cn(
                        styles.mobileToggle,
                        "fixed top-4 left-4 z-[60] bg-gradient-to-r from-[#bdc3c7] to-[#2c3e50] rounded-lg p-3",
                        "flex items-center justify-center shadow-lg",
                        "hover:from-[#2c3e50] hover:to-[#bdc3c7] transition-all duration-200",
                        "hover:scale-105 active:scale-95 md:hidden"
                    )}
                >

                        <div className="flex flex-col space-y-1">
                            <div className="w-5 h-0.5 bg-white rounded-full transition-all"></div>
                            <div className="w-5 h-0.5 bg-white rounded-full transition-all"></div>
                            <div className="w-5 h-0.5 bg-white rounded-full transition-all"></div>
                        </div>
                </button>
            )}

            {isMobile && isExpanded && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsExpanded(false)}
                />
            )}

            <aside
                className={cn(
                    styles.navbar,
                    "h-screen bg-gradient-to-b from-gray-900 to-gray-800 transition-all duration-300 ease-in-out relative z-50",
                    "border-r border-gray-700/50 backdrop-blur-sm",
                    isExpanded ? styles.expanded : styles.collapsed
                )}
            >
                <div className="h-full flex flex-col">
                    <div className="p-4 flex items-center justify-between border-b border-gray-700/30">
                        {isExpanded && (
                            <div className="text-white font-semibold text-lg">
                                Menu
                            </div>
                        )}
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className={cn(
                                "bg-gradient-to-r from-[#bdc3c7] to-[#2c3e50] rounded-lg p-2.5",
                                "flex items-center justify-center shadow-lg",
                                "hover:from-[#2c3e50] hover:to-[#bdc3c7] transition-all duration-200",
                                "hover:scale-105 active:scale-95",
                                !isExpanded ? "mx-auto" : ""
                            )}
                        >
                            {isMobile && isExpanded ? (
                                <X className="w-5 h-5 text-white"/>
                            ) : isExpanded ? (
                                <ChevronLeft className="w-5 h-5 text-white"/>
                            ) : (
                                <ChevronRight className="w-5 h-5 text-white"/>
                            )}
                        </button>
                    </div>

                    <nav className="flex-grow pt-6">
                        <ul className="space-y-2 px-1">
                            {options.map((option, index) => (
                                <SidebarOption
                                    key={index}
                                    icon={option.icon}
                                    title={option.title}
                                    href={option.href}
                                    isExpanded={isExpanded}
                                />
                            ))}
                        </ul>
                    </nav>

                    <div className="p-4 border-t border-gray-700/30">
                        {isExpanded && (
                            <div className="text-gray-400 text-xs text-center">
                                UFSM - Taller mecánico
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    )
}

type SidebarOptionProps = {
    icon: LucideIcon;
    title: string;
    href: string;
}

function SidebarOption({
                           icon: Icon,
                           title,
                           href,
                           isExpanded
                       }: SidebarOptionProps & { isExpanded: boolean }) {
    const [isActive, setIsActive] = useState(false);

    return (
        <li>
            <a
                href={href}
                onClick={() => setIsActive(!isActive)}
                className={cn(
                    "flex items-center p-3 rounded-xl transition-all duration-200 group relative",
                    "hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10",
                    "hover:backdrop-blur-sm hover:shadow-md",
                    isActive ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 shadow-md" : ""
                )}
            >
                <div
                    className={cn(
                        "flex items-center justify-center rounded-xl transition-all duration-300 shrink-0",
                        "bg-gradient-to-r from-[#bdc3c7] to-[#2c3e50] shadow-lg",
                        "group-hover:from-[#2c3e50] group-hover:to-[#bdc3c7] group-hover:scale-105 hover:transition-all duration-300",
                        isExpanded ? "w-10 h-10" : "w-12 h-12"
                    )}
                >
                    <Icon
                        className="w-5 h-5 text-white"
                        strokeWidth={1.5}
                    />
                </div>

                {isExpanded && (
                    <span
                        className="ml-4 text-white font-medium whitespace-nowrap overflow-hidden transition-all duration-300"
                    >
                        {title}
                    </span>
                )}

                {isActive && (
                    <div className="absolute right-2 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
                )}

                {!isExpanded && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {title}
                    </div>
                )}
            </a>
        </li>
    )
}

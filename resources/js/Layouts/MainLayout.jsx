import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import Dropdown from '@/Components/Dropdown';
import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Globe,
    ScrollText,
    History,
    Folder,
    Gift,
    LayoutDashboard,
    User,
    LogOut,
    LogIn,
    UserPlus,
    ChevronDown
} from 'lucide-react';

export default function MainLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen font-sans bg-gray-100">
            <nav className="border-b border-gray-100 bg-[#0a081e] text-white text-base">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        {/* Logo */}
                        <Link href={route('home')} className="flex items-center space-x-2">
                            <img src="/assets/logo-sorteillo.svg" alt="Sorteillo Logo" className="h-10 w-auto" />
                        </Link>

                        {/* Navegación (escritorio) */}
                        <div className="hidden sm:flex space-x-8 font-medium items-center">
                            {/* SORTEOS */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="hover:text-gray-300 flex items-center gap-1">
                                        Sorteos
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="left" width="64">
                                    <Dropdown.Link href={route('home')}>
                                        <Globe className="w-4 h-4 mr-2 inline" />
                                        Sorteo en Redes
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('sorteo.manual')}>
                                        <ScrollText className="w-4 h-4 mr-2 inline" />
                                        Sorteo Manual
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('sorteo.historial')}>
                                        <History className="w-4 h-4 mr-2 inline" />
                                        Historial
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>

                            {/* RASCAS */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="hover:text-gray-300 flex items-center gap-1">
                                        Rascas
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="left" width={280}>
                                    <Dropdown.Link href={route('colecciones.index')}>
                                        <Folder className="w-4 h-4 mr-2 inline" />
                                        Mis colecciones
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('rascas.premiados')}>
                                        <Gift className="w-4 h-4 mr-2 inline" />
                                        Mis rascas premiados
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>

                            {/* RULETA */}
                            <Link
                                href={route('ruleta')}
                                className="hover:text-gray-300 flex items-center gap-1 transition-colors duration-150"
                            >
                                Ruleta
                            </Link>

                        </div>

                        {/* Usuario o login (escritorio) */}
                        <div className="hidden sm:flex sm:items-center sm:space-x-4">
                            {user ? (
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="hover:text-gray-300 flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            <span>{user.name}</span>
                                            <ChevronDown className="w-4 h-4" />
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content align="right" width="56">
                                        <Dropdown.Link href={route('profile.edit')}>
                                            <User className="w-4 h-4 mr-2 inline" />
                                            Perfil
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('dashboard')}>
                                            <LayoutDashboard className="w-4 h-4 mr-2 inline" />
                                            Dashboard
                                        </Dropdown.Link>
                                        {user.is_admin && (
                                            <Dropdown.Link href={route('admin.users.index')}>
                                                <LayoutDashboard className="w-4 h-4 mr-2 inline" />
                                                Panel de Administración
                                            </Dropdown.Link>
                                        )}
                                        <Dropdown.Link method="post" href={route('logout')} as="button">
                                            <LogOut className="w-4 h-4 mr-2 inline" />
                                            Cerrar sesión
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            ) : (
                                <>
                                    <Link href={route('login')} className="px-4 py-2 text-sm text-white hover:text-gray-300">
                                        <LogIn className="w-4 h-4 inline-block mr-1" />
                                        Iniciar sesión
                                    </Link>
                                    <Link href={route('register')} className="px-4 py-2 text-sm bg-white text-black rounded hover:bg-gray-200">
                                        <UserPlus className="w-4 h-4 inline-block mr-1" />
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Menú móvil: hamburguesa */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(prev => !prev)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menú desplegable móvil */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    {user ? (
                        <>
                            <div className="space-y-1 pb-3 pt-2 px-4 text-black bg-white">
                                <div className="text-base font-medium">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>

                                <ResponsiveNavLink href={route('profile.edit')} active={route().current('profile.edit')}>
                                    Perfil
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </ResponsiveNavLink>
                                {user?.is_admin && (
                                    <ResponsiveNavLink href={route('admin.users.index')} active={route().current('admin.users.index')}>
                                        Panel de Administración
                                    </ResponsiveNavLink>
                                )}
                                <div className="border-t border-gray-200 my-2"></div>
                                <ResponsiveNavLink href={route('home')} active={route().current('home')}>
                                    Sorteo en Redes
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('sorteo.manual')} active={route().current('sorteo.manual')}>
                                    Sorteo Manual
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('sorteo.historial')} active={route().current('sorteo.historial')}>
                                    Historial de Sorteos
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('colecciones.index')} active={route().current('colecciones.index')}>
                                    Mis colecciones
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('rascas.premiados')} active={route().current('rascas.premiados')}>
                                    Mis rascas premiados
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('ruleta')} active={route().current('ruleta')}>
                                    Ruleta
                                </ResponsiveNavLink>
                                <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                    Cerrar sesión
                                </ResponsiveNavLink>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-1 p-4 bg-white text-black">
                            <ResponsiveNavLink href={route('login')}>Iniciar sesión</ResponsiveNavLink>
                            <ResponsiveNavLink href={route('register')}>Registrarse</ResponsiveNavLink>
                        </div>
                    )}
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}

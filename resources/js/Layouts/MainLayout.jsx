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
        <div className="min-h-screen flex flex-col font-sans bg-gray-100">
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
                                        {user.is_admin && (
                                            <Dropdown.Link href={route('admin.users.index')}>
                                                <LayoutDashboard className="w-4 h-4 mr-2 inline" />
                                                Administración
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
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 text-sm text-white border border-white rounded hover:bg-white hover:text-black transition"
                                    >
                                        <LogIn className="w-4 h-4 inline-block mr-1" />
                                        Iniciar sesión
                                    </Link>

                                    <Link
                                        href={route('register')}
                                        className="px-4 py-2 text-sm text-white border border-white rounded hover:bg-white hover:text-black transition"
                                    >
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

            <main className="flex-grow">
                {children}
            </main>

            <footer className="bg-[#0a081e] text-white text-sm">
                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <div className="text-center sm:text-left">
                        <p className="font-semibold">Sorteillo</p>
                        <p className="text-gray-400">© {new Date().getFullYear()} Todos los derechos reservados.</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <a href="https://bsky.app/profile/sorteillo.bsky.social" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4.36a9.27 9.27 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11 0c-2.66 0-4.82 2.25-4.82 5.02 0 .39.04.76.12 1.12A12.94 12.94 0 0 1 3 1.16 5.15 5.15 0 0 0 3.4 8.08a4.4 4.4 0 0 1-2.18-.63v.06c0 2.36 1.6 4.33 3.72 4.78a4.37 4.37 0 0 1-2.17.08 4.5 4.5 0 0 0 4.21 3.2A9.05 9.05 0 0 1 1 19.54a12.78 12.78 0 0 0 6.29 1.83c7.55 0 11.68-6.49 11.68-12.13 0-.19 0-.38-.01-.56A8.46 8.46 0 0 0 23 3z" />
                            </svg>
                        </a>

                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M7.75 2A5.75 5.75 0 0 0 2 7.75v8.5A5.75 5.75 0 0 0 7.75 22h8.5A5.75 5.75 0 0 0 22 16.25v-8.5A5.75 5.75 0 0 0 16.25 2h-8.5Zm0 1.5h8.5A4.25 4.25 0 0 1 20.5 7.75v8.5a4.25 4.25 0 0 1-4.25 4.25h-8.5A4.25 4.25 0 0 1 3.5 16.25v-8.5A4.25 4.25 0 0 1 7.75 3.5Zm8.75 2.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 1.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z" />
                            </svg>
                        </a>

                        <a href="https://github.com/schuman94/sorteos" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.92.58.11.79-.25.79-.55 0-.27-.01-1.16-.02-2.1-3.2.7-3.88-1.54-3.88-1.54-.53-1.36-1.3-1.72-1.3-1.72-1.06-.73.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.3 1.19-3.11-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.5 3.18-1.18 3.18-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.85 1.19 3.11 0 4.43-2.69 5.41-5.25 5.7.42.37.79 1.1.79 2.22 0 1.6-.01 2.89-.01 3.28 0 .3.21.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
                            </svg>
                        </a>

                        <a href="mailto:contacto@sorteillo.com" className="hover:text-gray-300 transition">
                            contacto@sorteillo.com
                        </a>
                    </div>
                </div>
            </footer>

        </div>
    );
}

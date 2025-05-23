import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import Dropdown from '@/Components/Dropdown';
import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function MainLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('home')}
                                    active={route().current('home')}
                                >
                                    Inicio
                                </NavLink>
                                <NavLink
                                    href={route('sorteo.manual')}
                                    active={route().current('sorteo.manual')}
                                >
                                    Sorteo Manual
                                </NavLink>
                                {user && (
                                    <NavLink
                                        href={route('sorteo.historial')}
                                        active={route().current('sorteo.historial')}
                                    >
                                        Historial de Sorteos
                                    </NavLink>
                                )}
                                <NavLink
                                    href={route('ruleta')}
                                    active={route().current('ruleta')}
                                >
                                    Ruleta
                                </NavLink>
                                <NavLink
                                    href={route('colecciones.index')}
                                    active={route().current('colecciones.index')}
                                >
                                    Rascas
                                </NavLink>

                                {user?.is_admin && (
                                    <NavLink
                                        href={route('admin.users.index')}
                                        active={route().current('admin.users.index')}
                                    >
                                        Panel de Administración
                                    </NavLink>
                                )}

                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            {user ? (
                                <div className="relative ms-3">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
                                                >
                                                    {user.name}
                                                    <svg
                                                        className="-me-0.5 ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>
                                                Perfil
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('dashboard')}>
                                                Dashboard
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                            >
                                                Cerrar sesión
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            ) : (
                                <>
                                    <Link href={route('login')} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
                                        Iniciar sesión
                                    </Link>
                                    <Link href={route('register')} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>

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

                {/* Dropdown para móvil */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    {user ? (
                        <>
                            <div className="space-y-1 pb-3 pt-2">
                                <ResponsiveNavLink href={route('profile.edit')} active={route().current('profile.edit')}>
                                    <div>
                                        <div className="text-base font-medium text-gray-800">{user.name}</div>
                                        <div className="text-sm font-medium text-gray-500">{user.email}</div>
                                    </div>
                                </ResponsiveNavLink>
                                {user?.is_admin && (
                                    <ResponsiveNavLink
                                        href={route('admin.users.index')}
                                        active={route().current('admin.users.index')}
                                    >
                                        Panel de Administración
                                    </ResponsiveNavLink>
                                )}

                            </div>
                            <div className="border-t border-gray-200 pb-1 pt-4">
                                <div className="mt-3 space-y-1">
                                    <ResponsiveNavLink href={route('home')} active={route().current('home')}>
                                        Inicio
                                    </ResponsiveNavLink>

                                    <ResponsiveNavLink href={route('sorteo.manual')} active={route().current('sorteo.manual')}>
                                        Sorteo Manual
                                    </ResponsiveNavLink>


                                    {user && (
                                        <ResponsiveNavLink href={route('sorteo.historial')} active={route().current('sorteo.historial')}>
                                            Historial de Sorteos
                                        </ResponsiveNavLink>
                                    )}

                                    <ResponsiveNavLink href={route('ruleta')} active={route().current('ruleta')}>
                                        Ruleta
                                    </ResponsiveNavLink>

                                    <ResponsiveNavLink href={route('colecciones.index')} active={route().current('colecciones.index')}>
                                        Rascas
                                    </ResponsiveNavLink>

                                    <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                        Cerrar sesión
                                    </ResponsiveNavLink>
                                </div>

                            </div>
                        </>
                    ) : (
                        <div className="space-y-1 p-4">
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

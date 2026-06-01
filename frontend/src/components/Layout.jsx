import { NavLink, Outlet } from 'react-router-dom';
import Toast from './Toast';

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/products', label: 'Products' },
  { to: '/customers', label: 'Customers' },
  { to: '/orders', label: 'Orders' },
];

export default function Layout() {
  return (
    <div className="layout">
      <header className="header">
        <div className="header-inner">
          <h1 className="logo">Inventory</h1>
          <nav className="nav">
            {navItems.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <Toast />
    </div>
  );
}

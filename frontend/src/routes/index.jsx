import { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import HiguraLayout from "../layout/HiguraLayout";
import DashboardPage from "../page/higura/DashboardPage";
import ClientsPage from "../page/higura/ClientsPage";
import ReportsPage from "../page/higura/ReportsPage";
import TransactionsPage from "../page/higura/TransactionsPage";
import ProductsPage from "../page/higura/ProductsPage";
import RentalsPage from "../page/higura/RentalsPage";
import SettingsCompanyPage from "../page/higura/SettingsCompanyPage";
import SettingsCompanyForm from "../page/higura/SettingsCompanyForm";
import SettingsUsersPage from "../page/higura/SettingsUsersPage";
import LoginPage from "../page/higura/LoginPage";
import RequireHiguraAuth from "../components/higura/RequireHiguraAuth";

// eslint-disable-next-line react-refresh/only-export-components
const SuspenseWrapper = ({ children }) => {
    return <Suspense fallback={'loading...'}>{children}</Suspense>
}

const routes = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: 'login',
                element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
            },
            {
                path: 'app',
                element: <RequireHiguraAuth><HiguraLayout /></RequireHiguraAuth>,
                children: [
                    {
                        index: true,
                        element: <Navigate to={'/app/dashboard'} replace />,
                    },
                    {
                        path: 'dashboard',
                        element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper>,
                    },
                    {
                        path: 'transactions',
                        element: <SuspenseWrapper><TransactionsPage /></SuspenseWrapper>,
                    },
                    {
                        path: 'products',
                        element: <SuspenseWrapper><ProductsPage /></SuspenseWrapper>,
                    },
                    {
                        path: 'rentals',
                        element: <SuspenseWrapper><RentalsPage /></SuspenseWrapper>,
                    },
                    {
                        path: 'clients',
                        element: <SuspenseWrapper><ClientsPage /></SuspenseWrapper>,
                    },
                    {
                        path: 'reports',
                        element: <SuspenseWrapper><ReportsPage /></SuspenseWrapper>,
                    },
                    {
                        path: 'settings',
                        element: <SuspenseWrapper><SettingsCompanyPage /></SuspenseWrapper>,
                        children: [
                            {
                                index: true,
                                element: <Navigate to={'/app/settings/company'} replace />,
                            },
                            {
                                path: 'company',
                                element: <SuspenseWrapper><SettingsCompanyForm /></SuspenseWrapper>,
                            },
                            {
                                path: 'users',
                                element: <SuspenseWrapper><SettingsUsersPage /></SuspenseWrapper>,
                            },
                        ]
                    },
                ]
            },
            {
                index: true,
                element: <Navigate to={'/app/dashboard'} replace />,
            },
            {
                path: '*',
                element: <Navigate to={'/app/dashboard'} replace />,
            }
        ]
    },
])
export default routes
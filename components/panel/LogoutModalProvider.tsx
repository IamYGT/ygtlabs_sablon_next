"use client";

import React, { createContext, useContext, useState } from 'react';
import LogoutModal from './LogoutModal';

type LogoutType = 'current' | 'all';

interface LogoutModalContextType {
    showLogoutModal: (type: LogoutType) => void;
    hideLogoutModal: () => void;
}

const LogoutModalContext = createContext<LogoutModalContextType | undefined>(undefined);

export function useLogoutModal() {
    const context = useContext(LogoutModalContext);
    if (!context) {
        throw new Error('useLogoutModal must be used within a LogoutModalProvider');
    }
    return context;
}

interface LogoutModalProviderProps {
    children: React.ReactNode;
}

export function LogoutModalProvider({ children }: LogoutModalProviderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [logoutType, setLogoutType] = useState<LogoutType>('current');

    const showLogoutModal = (type: LogoutType) => {
        setLogoutType(type);
        setIsOpen(true);
    };

    const hideLogoutModal = () => {
        setIsOpen(false);
    };

    return (
        <LogoutModalContext.Provider value={{ showLogoutModal, hideLogoutModal }}>
            {children}
            {/* Modal Portal ile render ediliyor */}
            <LogoutModal
                isOpen={isOpen}
                onClose={hideLogoutModal}
                logoutType={logoutType}
            />
        </LogoutModalContext.Provider>
    );
} 
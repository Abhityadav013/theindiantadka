import React, { createContext, useContext, useState, useRef } from 'react';

interface TipContextType {
    selectedTip: number | string | undefined;
    setSelectedTip: React.Dispatch<React.SetStateAction<number | string | undefined>>;
    scrollToTipOptions: () => void;
    tipOptionsRef: React.RefObject<HTMLDivElement | null>; // Updated type to include null
}

const TipContext = createContext<TipContextType | undefined>(undefined);

export const useTipContext = () => {
    const context = useContext(TipContext);
    if (!context) {
        throw new Error("useTipContext must be used within a TipProvider");
    }
    return context;
};

export const TipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedTip, setSelectedTip] = useState<number | string | undefined>();
    const tipOptionsRef = useRef<HTMLDivElement | null>(null); // Allow ref to be null initially

    const scrollToTipOptions = () => {
        if (tipOptionsRef.current) {
            tipOptionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <TipContext.Provider value={{ selectedTip, setSelectedTip, scrollToTipOptions, tipOptionsRef }}>
            {children}
        </TipContext.Provider>
    );
};

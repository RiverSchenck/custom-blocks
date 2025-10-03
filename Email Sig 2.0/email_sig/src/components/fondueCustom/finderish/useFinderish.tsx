import { useState } from 'react';

export const useFinderDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputId, setInputId] = useState<string | null>(null);

    const open = (id: string) => {
        setInputId(id);
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
        setInputId(null);
    };

    return {
        isOpen,
        openFinderFor: open,
        closeFinder: close,
        inputId,
    };
};

import React, { FC, ReactNode, useState } from 'react';

type FlyoutProps = {
    children: ReactNode;
    hoverContent: ReactNode; // Content to display on hover
};

const Flyout: FC<FlyoutProps> = ({ children, hoverContent }) => {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{ position: 'relative', display: 'inline-block', marginRight: '3px' }}
        >
            {children}

            {isHovering && (
                <div
                    style={{
                        position: 'absolute',
                        backgroundColor: '#333',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '4px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                    }}
                >
                    {hoverContent}
                </div>
            )}
        </div>
    );
};

export default Flyout;

import React, { useState } from 'react';

type ColorCircleProps = {
    color: string;
    name: string;
    onClick?: () => void; // Optional click handler if the circle is clickable
};

const ColorCircle = ({ color, name, onClick }: ColorCircleProps) => {
    const [isHovering, setIsHovering] = useState(false);

    const style = {
        backgroundColor: color,
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'inline-block',
        boxShadow: isHovering ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.2)',
        transition: 'box-shadow 0.3s ease-in-out',
        cursor: 'pointer',
    };

    // Handle key events for accessibility
    const handleKeyDown = (event: React.KeyboardEvent) => {
        // Trigger onClick when space or enter keys are pressed
        if (event.key === 'Enter' || event.key === ' ') {
            onClick?.();
        }
    };

    return (
        <div
            style={style}
            aria-label={name}
            role="button" // Role indicating this is a button-like element
            tabIndex={0} // Makes the element focusable
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={onClick}
            onKeyDown={handleKeyDown} // Allows keyboard interaction
        ></div>
    );
};

export default ColorCircle;

import React, { FC, useState } from 'react';

type ColorBlockProps = {
    color: string;
    name: string;
};

const ColorBlock: FC<ColorBlockProps> = ({ color, name }) => {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div style={{ position: 'relative', display: 'inline-block', marginRight: '10px', zIndex: isHovering ? 1 : 0 }}>
            <div
                style={{
                    backgroundColor: color,
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    boxShadow: '0 0 2px #000', // Adding a subtle shadow
                }}
                className="w-7 h-7 rounded-full cursor-pointer"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            />

            {isHovering && (
                <div
                    style={{
                        position: 'absolute',
                        backgroundColor: '#333', // Slightly lighter background color
                        color: 'white',
                        padding: '5px',
                        borderRadius: '4px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        top: '30px', // Adjust the positioning as needed
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }}
                >
                    <div style={{ fontWeight: 'bold' }}>{name}</div>
                    <div
                        style={{
                            backgroundColor: '#999', // Grey background around color value
                            color: '#4c4c4c', // Grey text color
                            padding: '2px',
                            marginTop: '4px',
                            borderRadius: '4px',
                            textAlign: 'center',
                        }}
                    >
                        {color}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColorBlock;

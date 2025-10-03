import React, { FC, useState } from 'react';

type NumberBlockProps = {
    number: string; // Assuming number is passed as a string
    name: string;
};

const NumberBlock: FC<NumberBlockProps> = ({ number, name }) => {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div style={{ position: 'relative', display: 'inline-block', marginRight: '3px', zIndex: isHovering ? 1 : 0 }}>
            <div
                style={{
                    backgroundColor: '#343434', // Black-grey background
                    width: 'auto', // Adjust width as needed
                    height: '20px', // Adjust height as needed
                    borderRadius: '4px', // Rounded corners
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px 6px 2px 6px',
                    justifyContent: 'center',
                    color: 'white', // Text color
                    fontSize: '13px', // Adjust font size as needed
                    marginBottom: '4px',
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {name}
            </div>

            {isHovering && (
                <div
                    style={{
                        position: 'absolute',
                        backgroundColor: '#333',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '4px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        top: '40px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }}
                >
                    <div style={{ fontWeight: 'bold' }}>{name}</div>
                    <div
                        style={{
                            backgroundColor: '#999',
                            color: '#4c4c4c',
                            padding: '2px',
                            marginTop: '4px',
                            borderRadius: '4px',
                            textAlign: 'center',
                        }}
                    >
                        {number}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NumberBlock;

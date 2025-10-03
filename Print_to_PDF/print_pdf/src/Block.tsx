import { useBlockSettings } from '@frontify/app-bridge';
import { type BlockProps } from '@frontify/guideline-blocks-settings';
import { type FC } from 'react';

type Settings = {
    color: 'violet' | 'blue' | 'green' | 'red';
};

const colorStyleMap: Record<Settings['color'], string> = {
    violet: 'rgb(113,89,215)',
    blue: '#2563EB',
    green: '#16A34A',
    red: '#DC2626',
};

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
    const [blockSettings] = useBlockSettings<Settings>(appBridge);

    const handlePrintPage = () => {
        window.print();
    };

    return (
        <div style={{ position: 'relative', padding: '1.5rem', backgroundColor: '#F9FAFB' }}>
            {/* Floating Rectangle */}
            <div
                style={{
                    position: 'absolute',
                    top: '-50px', // Adjust to set how high above the content it floats
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'white',
                    width: '90%',
                    padding: '1rem 2rem',
                    borderRadius: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    zIndex: 4,
                }}
            >
                {/* Text Content */}
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>R&D Owner:</span>
                    <span>NPTC Coffee</span>

                    <span style={{ fontWeight: 'bold' }}>Status:</span>
                    <span>POC</span>

                    <span style={{ fontWeight: 'bold' }}>Pillar:</span>
                    <span>Products</span>

                    <span style={{ fontWeight: 'bold' }}>Enabling Technology:</span>
                    <span>AI</span>
                </div>

                {/* Print Icon */}
                <button
                    onClick={handlePrintPage}
                    style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    <img
                        src="https://img.icons8.com/ios-filled/24/000000/print.png" // Replace with your preferred print icon URL
                        alt="Print Icon"
                        style={{ width: '24px', height: '24px' }}
                    />
                </button>
            </div>
        </div>
    );
};

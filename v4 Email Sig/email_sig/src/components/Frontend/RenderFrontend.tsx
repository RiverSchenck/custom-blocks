import React, { useState } from 'react';
import { InputItem, Settings } from '../../types';
import { generateRandomId } from '../../components/helpers';
import {
    Button,
    ButtonRounding,
    ButtonSize,
    ButtonStyle,
    ButtonType,
    IconCheckMarkCircle,
    IconCrossCircle,
    IconSize,
} from '@frontify/fondue';
import FrontendInputs from './FrontendInputs';
import styles, { FadeInOutDiv } from '../../styles';
import { livePreview } from '../../components/LivePreview';
import useFontSettings from '../../hooks/useFontSettings';
import { handleCopyToClipboard } from './copyToClipboard';
import { ColorPalette } from '@frontify/app-bridge';

interface RenderFrontendProps {
    inputs: InputItem[];
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>;
    colorPickerPalettes: string[];
    blockSettings: Settings;
    appBridgeColorPalettes: ColorPalette[];
}

const RenderFrontend = ({
    inputs,
    setInputs,
    colorPickerPalettes,
    blockSettings,
    appBridgeColorPalettes,
}: RenderFrontendProps) => {
    const [copyStatus, setCopyStatus] = useState('idle'); // 'idle', 'success', 'failure'
    const copyTable = `copy-Table-${generateRandomId()}`;
    const fontFamily = useFontSettings(blockSettings);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
            <div style={{ display: 'flex', flexGrow: 1 }}>
                <div style={{ width: '50%', marginRight: '5%' }}>
                    <div style={styles.frontendInputs}>
                        {inputs.map((input) => (
                            <FrontendInputs
                                key={input.id}
                                input={input}
                                inputs={inputs}
                                setInputs={setInputs}
                                colorPickerPalettes={colorPickerPalettes}
                                appBridgeColorPalettes={appBridgeColorPalettes}
                            />
                        ))}
                    </div>
                </div>
                <div style={{ width: '50%' }}>
                    <div id={copyTable} style={{ display: 'block' }}>
                        {livePreview(inputs, true, fontFamily, blockSettings)}
                    </div>
                    <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
                        <Button
                            onClick={() => handleCopyToClipboard(copyTable, setCopyStatus)}
                            rounding={ButtonRounding['Medium']}
                            size={ButtonSize['Small']}
                            style={ButtonStyle['Primary']}
                            type={ButtonType['Button']}
                            hugWidth={true}
                        >
                            Copy Signature
                        </Button>
                        {copyStatus === 'success' ? (
                            <FadeInOutDiv style={{ color: 'green', marginLeft: '5px' }}>
                                <IconCheckMarkCircle size={IconSize.Size24} />
                            </FadeInOutDiv>
                        ) : null}
                        {copyStatus === 'failure' ? (
                            <FadeInOutDiv style={{ color: 'red', marginLeft: '5px' }}>
                                <IconCrossCircle size={IconSize.Size24} filled={true} />
                            </FadeInOutDiv>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RenderFrontend;

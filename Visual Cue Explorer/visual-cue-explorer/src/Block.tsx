import { useBlockSettings, useEditorState } from '@frontify/app-bridge';
import { type BlockProps } from '@frontify/guideline-blocks-settings';
import { type FC, useState } from 'react';

import ItemTable from './components/Table';
import ColorCircle from './components/colorCircle';
import { type ColorImageMap } from './types';

type Settings = {
    color: 'violet' | 'blue' | 'green' | 'red';
};

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
    const [blockSettings] = useBlockSettings<Settings>(appBridge);
    const [colorImageMap, setColorImageMap] = useState<ColorImageMap>({});
    const isEditing = useEditorState(appBridge);

    const updateColorImageMap = (color: string, imageUrl: string) => {
        setColorImageMap((prevMap) => ({
            ...prevMap,
            [color]: imageUrl,
        }));
    };

    return (
        <div>
            {isEditing ? (
                <div>
                    <ColorCircle name={'Test'} color={'#000000'} />
                    <ItemTable
                        appBridge={appBridge}
                        colorImageMap={colorImageMap}
                        setColorImageMap={setColorImageMap}
                    />
                </div>
            ) : (
                <div>Frontend user consumption area</div>
            )}
        </div>
    );
};

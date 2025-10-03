import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useBlockAssets, useBlockSettings } from '@frontify/app-bridge';
import type { BlockProps } from '@frontify/guideline-blocks-settings';
import ColorBlock from './ColorBlock';
import NumberBlock from './NumberBlock';
import { parseTokens } from '@tokens-studio/sd-transforms';
import type { DesignTokens } from 'style-dictionary/types';


type Settings = {
    Test: string;
};

interface DesignToken {
    name: string;
    value?: string;
    type?: string;
    description?: string;
}

type DataGroup = {
    name: string;
    id: number;
    children?: DataGroup[];
    tokens?: DesignToken[];
    type?: string;
};

type Counter = { value: number };

const extractData = (data: { [key: string]: any }, counter: Counter, parentGroup?: DataGroup): DataGroup[] => {
    return Object.entries(data)
        .map(([key, value]): DataGroup => {
            if (value && typeof value === 'object' && 'value' in value && 'type' in value) {
                const token = { ...value, name: key } as DesignToken;
                if (parentGroup) {
                    parentGroup.tokens = [...(parentGroup.tokens || []), token];
                }
                return null;
            } else {
                const newGroup: DataGroup = { name: key, type: 'group', tokens: [], children: [], id: counter.value++ };
                const childGroups = extractData(value, counter, newGroup);
                newGroup.children = childGroups.filter((group) => group !== null);
                return newGroup;
            }
        })
        .filter((group) => group !== null);
};

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
    const [blockSettings] = useBlockSettings<Settings>(appBridge);
    const { blockAssets } = useBlockAssets(appBridge);
    const designTokenSource = blockAssets?.DesignTokenSource?.[0].originUrl;
    const [colorGroups, setColorGroups] = useState<DataGroup[]>([]);

    useEffect(() => {
        console.log(designTokenSource);
        if (designTokenSource) {
            fetch(designTokenSource)
                .then((response) => response.json())
                .then((data) => {
                    const counter = { value: 0 };
                    const variables = extractData(data, counter);
                    setColorGroups(variables);

                    const tokens = data;
                    const parsed = parseTokens(tokens) as DesignTokens;
                    console.log(parsed);
                })
                .catch((error) => console.error('Error loading JSON:', error));
        }
    }, [blockAssets]);

    const renderToken = (token: DesignToken) => {
        // Check if the token is a color token and render the ColorBlock
        if (token.type === 'color') {
            return <ColorBlock key={token.name} color={token.value} name={token.name} />;
        }

        // Check if the token is a number token and render the NumberBlock
        if (token.type === 'number') {
            return <NumberBlock key={token.name} number={token.value} name={token.name} />;
        }

        // Default rendering for other token types
        return (
            <span key={token.name} style={{ marginRight: '10px' }}>
                {token.name}: {token.value}
            </span>
        );
    };

    const GroupHeader = ({ name, depth, lineStyle, curveStyle }) => {
        return (
            <div style={{marginTop: '5px'}}>
                {depth > 0 && <div style={lineStyle} />}
                {depth > 0 && <div style={curveStyle} />}
                <p style={{ zIndex: 1 }}>{name}</p>
            </div>
        );
    };

    const renderGroup = (group: DataGroup, depth: number = 0) => {
        const offsetVal = 10;
        const indentStyle = {
            paddingLeft: `${depth * offsetVal}px`,
            position: 'relative',
        };
        const lineStyle = {
            position: 'absolute',
            top: '20px', // Start below the group name
            bottom: 0,
            left: `${depth * offsetVal + 2}px`,
            borderLeft: '1px solid #ccc', // Vertical line
            marginBottom: '23px',
            zIndex: 0,
        };
        const curveStyle = {
            position: 'absolute',
            left: `${depth * offsetVal + 2}px`, // Align with the vertical line
            bottom: '0',
            width: '4px', // Width of the curve
            height: '10px', // Height of the curve
            borderBottom: '1px solid #ccc', // Bottom border
            borderLeft: '1px solid #ccc', // Right border
            borderRadius: '0 0 0 4px', // Only bottom right corner is rounded
            marginBottom: '15px',
            zIndex: 1,
        };

        if (group.tokens && group.tokens.length > 0) {
            return (
                <div key={group.name} style={{ ...indentStyle, marginBottom: '5px' }}>
                    <GroupHeader name={group.name} depth={depth} lineStyle={lineStyle} curveStyle={curveStyle} />
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            position: 'relative',
                            zIndex: 1,
                            marginLeft: '15px',
                        }}
                    >
                        {group.tokens.map((token) => (
                            <div key={token.name}>{renderToken(token)}</div>
                        ))}
                    </div>
                </div>
            );
        } else if (group.children && group.children.length > 0) {
            return (
                <div id={group.name} key={group.name} style={{ ...indentStyle }}>
                    <GroupHeader name={group.name} depth={depth} lineStyle={lineStyle} curveStyle={curveStyle} />
                    {group.children.map((child) => renderGroup(child, depth + 1))}
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <h2>Figma Variables</h2>
            {colorGroups.length === 0 ? <p>Loading...</p> : colorGroups.map((group) => renderGroup(group))}
        </div>
    );
};

import { LinkOutlined } from '@ant-design/icons';
import { type Color, useBlockSettings } from '@frontify/app-bridge';
import { type BlockProps } from '@frontify/guideline-blocks-settings';
import { Button, Flex, message, Tag, Tooltip, Typography } from 'antd';
import { type FC, useEffect, useState } from 'react';

type Settings = {
    id?: string;
    legacy_id?: string;
    background_color?: Color | null;
};

const colorToRgba = (color: Color): string => `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;

const isDark = (r: number, g: number, b: number): boolean => {
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
};

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
    const [blockSettings] = useBlockSettings<Settings>(appBridge);
    const [blockId, setBlockId] = useState<string | null>(null);

    useEffect(() => {
        const id = appBridge.context('blockId').get();
        setBlockId(id ? String(id) : null);
    }, [appBridge]);

    const id = (blockSettings.id ?? '').trim();
    const legacyId = (blockSettings.legacy_id ?? '').trim();
    const tagText = [id, legacyId].filter(Boolean).join(' | ');
    const bgColor = blockSettings.background_color;

    const handleCopyLink = async () => {
        if (!blockId) {
            return;
        }

        const url = new URL(window.location.href);
        const baseHash = url.hash.replace(/:\d+$/, '') || '#';
        url.hash = baseHash + (baseHash.endsWith(':') ? '' : ':') + blockId;
        const linkUrl = url.toString();

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(linkUrl);
                await message.success('Link copied to clipboard!');
                return;
            }
        } catch (error) {
            console.error('Clipboard API failed:', error);
        }

        try {
            const textArea = document.createElement('textarea');
            textArea.value = linkUrl;
            textArea.setAttribute('readonly', '');
            Object.assign(textArea.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '2em',
                height: '2em',
                padding: '0',
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                background: 'transparent',
                opacity: '0',
                zIndex: '-9999',
            });
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const ok = document.execCommand('copy');
            document.body.removeChild(textArea);
            if (ok) {
                await message.success('Link copied to clipboard!');
            } else {
                await message.error('Failed to copy link. Please copy manually.');
            }
        } catch (error) {
            console.error('Fallback copy failed:', error);
            await message.error('Failed to copy link. Please copy manually.');
        }
    };

    if (!tagText) {
        return null;
    }

    const tagStyle = bgColor
        ? {
              backgroundColor: colorToRgba(bgColor),
              borderColor: colorToRgba(bgColor),
              color: isDark(Number(bgColor.red ?? 0), Number(bgColor.green ?? 0), Number(bgColor.blue ?? 0))
                  ? 'rgba(255,255,255,0.95)'
                  : 'rgba(0,0,0,0.88)',
          }
        : undefined;

    return (
        <Flex
            align="center"
            gap="small"
            wrap="nowrap"
            style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid #f0f0f0',
                backgroundColor: '#fafafa',
                width: 'fit-content',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
        >
            <Typography.Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>
                Rule
            </Typography.Text>
            <Tag
                style={{
                    margin: 0,
                    padding: '4px 12px',
                    fontSize: 13,
                    fontWeight: 500,
                    borderRadius: 6,
                    ...tagStyle,
                }}
            >
                <Typography.Text
                    style={{
                        fontWeight: 500,
                        fontSize: 13,
                    }}
                >
                    {tagText}
                </Typography.Text>
            </Tag>
            {blockId && (
                <Tooltip title="Copy link to this block">
                    <Button
                        type="text"
                        size="small"
                        icon={<LinkOutlined />}
                        onClick={handleCopyLink}
                        style={{
                            color: 'rgba(0,0,0,0.45)',
                            width: 28,
                            height: 28,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 6,
                        }}
                    />
                </Tooltip>
            )}
        </Flex>
    );
};

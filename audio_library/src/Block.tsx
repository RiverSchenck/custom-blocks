import { FC, useEffect, useState } from 'react';
import { useBlockSettings } from '@frontify/app-bridge';
import type { BlockProps } from '@frontify/guideline-blocks-settings';
import { Button, ButtonStyle, IconMagnifier16, TextInput, TextInputType } from '@frontify/fondue';
import { Token, authorize } from '@frontify/frontify-authenticator';
import AudioAsset, { AssetProps } from './components/AudioAsset';

interface Settings {
    brandDropdown: string;
    librariesDropdown: string;
}

export const Audio_Library: FC<BlockProps> = ({ appBridge }) => {
    const [blockSettings] = useBlockSettings<Settings>(appBridge);
    const [searchValue, setSearchValue] = useState('');
    const [token, setToken] = useState<Token | null>(null);
    const [audioAssets, setAudioAssets] = useState<AssetProps[]>([]);

    useEffect(() => {
        const savedTokenInfo = localStorage.getItem('frontify_token');
        if (savedTokenInfo) {
            const { expirationTime, ...token } = JSON.parse(savedTokenInfo);
            if (new Date().getTime() > expirationTime) {
                localStorage.removeItem('frontify_token');
                setToken(null);
            } else {
                setToken(token);
                //fetchBrands(token);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAuthenticate = async () => {
        try {
            const fetchedToken = await authorize({
                domain: 'demo.frontify.com',
                clientId: 'client-gxchzbkgspuparqo',
                scopes: ['basic:read'],
            });
            const expirationTime = new Date().getTime() + 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
            localStorage.setItem('frontify_token', JSON.stringify({ ...fetchedToken, expirationTime }));
            setToken(fetchedToken);
            //fetchBrands(fetchedToken);
        } catch (error) {
            console.error('Failed to authorize:', error);
        }
    };

    const handleTextChange = (newValue: string) => {
        setSearchValue(newValue);
    };

    const searchAudio = async (): Promise<void> => {
        const libraryId = blockSettings.librariesDropdown;

        if (!libraryId) {
            console.error('Invalid library selected');
            return;
        }

        const tokenString = localStorage.getItem('frontify_token');
        if (!tokenString) {
            console.error('Token string is not available in local storage. Please authenticate first.');
            return;
        }

        const usedToken: Token = JSON.parse(tokenString) as Token;
        if (!usedToken || !usedToken.bearerToken) {
            console.error('Token object is malformed. Please authenticate again.');
            return;
        }

        try {
            const response = await fetch(`https://${usedToken.bearerToken.domain}/graphql`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${usedToken.bearerToken.accessToken}`,
                },
                body: JSON.stringify({
                    query: `
                        query LibraryById($id: ID!, $search: String!) {
                            library(id: $id) {
                                assets(limit: 100, page: 1, query: {search: $search, sortBy: TITLE_ASCENDING, type: AUDIO}) {
                                    items {
                                        ... on Audio {
                                            id
                                            title
                                            previewUrl
                                        }
                                    }
                                }
                            }
                        }
                    `,
                    variables: {
                        id: libraryId,
                        search: searchValue,
                    },
                }),
            });

            const data = await response.json();
            console.log(data);

            if (data && data.data && data.data.library && Array.isArray(data.data.library.assets.items)) {
                setAudioAssets(data.data.library.assets.items);
            } else {
                console.error('Unexpected data format:', data);
            }
        } catch (error) {
            console.error('Error fetching audio assets:', error);
        }
    };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'nowrap' }}>
                <div style={{ width: '100%', marginRight: '16px' }}>
                    <TextInput
                        decorator={<IconMagnifier16 />}
                        onChange={handleTextChange}
                        type={TextInputType.Text}
                        value={searchValue}
                        placeholder="Search Assets"
                        disabled={token ? false : true}
                        onEnterPressed={searchAudio}
                    />
                </div>
                {token ? (
                    <Button onClick={searchAudio} style={ButtonStyle.Secondary}>
                        Search
                    </Button>
                ) : (
                    <Button onClick={handleAuthenticate} style={ButtonStyle.Secondary}>
                        Authenticate with Frontify
                    </Button>
                )}
            </div>
            <div style={{ marginTop: '20px' }}>
                {audioAssets.map((asset) => (
                    <AudioAsset key={asset.id} id={asset.id} title={asset.title} previewUrl={asset.previewUrl} />
                ))}
            </div>
        </>
    );
};

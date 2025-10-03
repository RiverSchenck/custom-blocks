import { FC, useEffect, useState } from 'react';
// import { setBlockSettings, useBlockSettings } from '@frontify/app-bridge';
import { BlockProps } from '@frontify/guideline-blocks-settings';
import {
    Button,
    ButtonSize,
    ButtonStyle,
    IconCaretDown12,
    IconCaretRight12,
    IconMagnifier16,
    TextInput,
    TextInputType,
} from '@frontify/fondue';
import { Token, authorize } from '@frontify/frontify-authenticator';
import BrandAssets, { BrandAssetsProps } from './components/BrandAssets';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CustomSearch: FC<BlockProps> = ({ appBridge }) => {
    // const [blockSettings, setBlockSettings] = useBlockSettings<Settings>(appBridge);
    const [token, setToken] = useState<Token | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [brands, setBrands] = useState<{ id: string; name: string; isChecked: boolean }[]>([]);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [fetchedAssets, setFetchedAssets] = useState<BrandAssetsProps[]>([]);

    useEffect(() => {
        const savedTokenInfo = localStorage.getItem('frontify_token');
        if (savedTokenInfo) {
            const { expirationTime, ...token } = JSON.parse(savedTokenInfo);
            if (new Date().getTime() > expirationTime) {
                localStorage.removeItem('frontify_token');
                setToken(null);
            } else {
                setToken(token);
                fetchBrands(token);
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
            fetchBrands(fetchedToken);
        } catch (error) {
            console.error('Failed to authorize:', error);
        }
    };

    const handleTextChange = (newValue: string) => {
        setSearchValue(newValue);
    };

    const fetchBrands = (currentToken?: Token) => {
        const usedToken = currentToken || token; // Use the provided token or the state token

        if (!usedToken) {
            console.error('Token is not available. Please authenticate first.');
            return;
        }
        console.log('Brands Request');

        fetch(`https://${usedToken.bearerToken.domain}/graphql`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${usedToken.bearerToken.accessToken}`,
            },
            body: JSON.stringify({
                query: `
                    query ListBrands {
                        brands {
                            id
                            name
                        }
                    }
                `,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data && data.data && Array.isArray(data.data.brands)) {
                    setBrands(data.data.brands);
                }
                console.log(brands);
            })
            .catch((error) => {
                console.error('Error fetching brands:', error);
            });
    };

    const toggleBrandCheck = (brandId: string) => {
        setBrands((prevBrands) =>
            prevBrands.map((brand) => (brand.id === brandId ? { ...brand, isChecked: !brand.isChecked } : brand)),
        );
    };

    const selectAllBrands = () => {
        setBrands((prevBrands) => prevBrands.map((brand) => ({ ...brand, isChecked: true })));
    };

    const deselectAllBrands = () => {
        setBrands((prevBrands) => prevBrands.map((brand) => ({ ...brand, isChecked: false })));
    };

    const handleIconClick = (brandId: string) => {
        // Implement the desired behavior when the icon is clicked
        console.log(`Icon clicked for brand ID: ${brandId}`);
    };

    const brandDropdown = () => (
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative' }}>
                <Button
                    hugWidth
                    icon={<IconCaretDown12 />}
                    onClick={() => setDropdownVisible(!isDropdownVisible)}
                    size={ButtonSize.Medium}
                >
                    Brands
                </Button>
                {isDropdownVisible && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: '0',
                            zIndex: 1000,
                            border: '1px solid #ccc',
                            backgroundColor: 'white',
                            width: '250px',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                            overflow: 'visible',
                            maxHeight: 'calc(20 * 28px)',
                            overflowY: 'auto',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '8px',
                                borderBottom: '1px solid #eee',
                            }}
                        >
                            <Button onClick={selectAllBrands} size={ButtonSize.Small}>
                                Select All
                            </Button>
                            <Button onClick={deselectAllBrands} size={ButtonSize.Small}>
                                Deselect All
                            </Button>
                        </div>
                        {brands.map((brand) => (
                            <div key={brand.id} style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
                                <input
                                    type="checkbox"
                                    checked={brand.isChecked}
                                    onChange={() => toggleBrandCheck(brand.id)}
                                />
                                <span style={{ marginLeft: '8px' }}>{brand.name}</span>
                                <button
                                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                    onClick={() => handleIconClick(brand.id)}
                                >
                                    <IconCaretRight12 />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    const searchGlobal = async () => {
        if (!token) {
            console.error('Token is not available. Please authenticate first.');
            return;
        }

        // Prepare the results container
        const brandAssets = [];
        let totalFetched = 0;
        const maxResults = 250;

        const tempBrands = [
            {
                id: 'eyJpZGVudGlmaWVyIjoyMjE4LCJ0eXBlIjoiYnJhbmQifQ==',
                name: 'River Sandbox',
                isChecked: true,
            },
            {
                id: 'eyJpZGVudGlmaWVyIjoxMzk0LCJ0eXBlIjoiYnJhbmQifQ==',
                name: 'Monobrand - Technical Solutions',
                isChecked: true,
            },
            {
                id: 'eyJpZGVudGlmaWVyIjoyMjE1LCJ0eXBlIjoiYnJhbmQifQ==',
                name: 'Rivers Fitbit',
                isChecked: true,
            },
        ];

        // Fetch assets for each checked brand
        for (const brand of tempBrands) {
            if (totalFetched >= maxResults) {
                break; // Break out of the loop if maxResults is reached
            }

            if (brand.isChecked) {
                try {
                    const remaining = maxResults - totalFetched; // Calculate how many more we can fetch
                    const response = await fetch(`https://${token.bearerToken.domain}/graphql`, {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token.bearerToken.accessToken}`,
                            'x-frontify-beta': 'enabled',
                        },
                        body: JSON.stringify({
                            query: `
                            query BrandWorkspaceProjects ($id: ID!, $query:BrandQueryInput!) {
                                brand(id: $id) {
                                    search(query: $query, page: 1, limit: 100){
                                        total
                                        items{
                                            ... on Image {
                                                title
                                                previewUrl
                                                __typename
                                            }
                                            ... on Document{
                                                title
                                                previewUrl
                                                __typename
                                            }
                                            ... on Video{
                                                title
                                                previewUrl
                                                __typename
                                            }
                                            ... on Audio{
                                                title
                                                previewUrl
                                                __typename
                                            }
                                            ... on File{
                                                title
                                                previewUrl
                                                __typename
                                            }
                                        }
                                    }
                                }
                            }`,
                            variables: {
                                id: brand.id,
                                query: {
                                    term: searchValue,
                                    filter: {
                                        sources: [
                                            {
                                                type: 'LIBRARIES',
                                                ids: [
                                                    /* Put the library ids if available */
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                        }),
                    });

                    const data = await response.json();
                    console.log('Interbrand Request');
                    // Log GraphQL errors if present
                    if (data.errors) {
                        console.error('GraphQL Errors for brand', brand.name, data.errors);
                        continue;
                    }

                    // Use optional chaining to safely access the items
                    const searchResults = data?.data?.brand?.search;
                    const items = searchResults?.items;
                    const itemsTotal = searchResults?.total;

                    if (items && typeof itemsTotal === 'number') {
                        const assetsToPush = items.slice(0, remaining);
                        totalFetched += assetsToPush.length;
                        brandAssets.push({
                            brandName: brand.name,
                            assets: assetsToPush,
                            total: itemsTotal,
                        });
                    }
                } catch (error) {
                    console.error(`Failed to fetch assets for brand ${brand.name}:`, error);
                }
            }
        }

        // Update state to render the assets using the BrandAssets component
        setFetchedAssets(brandAssets);
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
                        onEnterPressed={searchGlobal}
                    />
                </div>
                {token ? (
                    <Button onClick={searchGlobal} style={ButtonStyle.Secondary}>
                        Search
                    </Button>
                ) : (
                    <Button onClick={handleAuthenticate} style={ButtonStyle.Secondary}>
                        Authenticate with Frontify
                    </Button>
                )}
            </div>
            {brandDropdown()}
            {fetchedAssets.map((brandAsset, index) => (
                <BrandAssets
                    key={index}
                    brandName={brandAsset.brandName}
                    assets={brandAsset.assets}
                    total={brandAsset.total}
                />
            ))}
        </>
    );
};

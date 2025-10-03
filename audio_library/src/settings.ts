import { DropdownSize, defineSettings } from '@frontify/guideline-blocks-settings';
import { Token } from '@frontify/frontify-authenticator';

const fetchBrands = async (): Promise<{ value: string; label: string }[]> => {
    const tokenString = localStorage.getItem('frontify_token');

    if (!tokenString) {
        console.error('Token string is not available in local storage. Please authenticate first.');
        return [];
    }

    const usedToken: Token = JSON.parse(tokenString) as Token;

    if (!usedToken || !usedToken.bearerToken) {
        console.error('Token object is malformed. Please authenticate again.');
        return [];
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
                    query ListBrands {
                        brands {
                            id
                            name
                        }
                    }
                `,
            }),
        });

        const data = await response.json();

        if (data && data.data && Array.isArray(data.data.brands)) {
            // Transform brands into desired format
            console.log(data.data.brands);
            return data.data.brands.map((brand: { id: string; name: string }) => ({
                value: brand.id,
                label: brand.name,
            }));
        } else {
            console.error('Unexpected data format:', data);
            return [];
        }
    } catch (error) {
        console.error('Error fetching brands:', error);
        return [];
    }
};

const fetchLibraries = async (bundle: any): Promise<{ value: string; label: string }[]> => {
    const brandId = bundle.getBlock('brandDropdown')?.value;
    console.log(brandId);

    if (!brandId || brandId === 'None') {
        console.error('Invalid brand selected');
        return [];
    }
    const tokenString = localStorage.getItem('frontify_token');

    if (!tokenString) {
        console.error('Token string is not available in local storage. Please authenticate first.');
        return [];
    }

    const usedToken: Token = JSON.parse(tokenString) as Token;

    if (!usedToken || !usedToken.bearerToken) {
        console.error('Token object is malformed. Please authenticate again.');
        return [];
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
                    query BrandLibraries($id: ID!) {
                        brand(id: $id) {
                            libraries(page: 1, limit: 50) {
                                items {
                                    type: __typename
                                    id
                                    name
                                }
                            }
                        }
                    }
                `,
                variables: {
                    id: brandId,
                },
            }),
        });

        const data = await response.json();

        if (
            data &&
            data.data &&
            data.data.brand &&
            data.data.brand.libraries &&
            Array.isArray(data.data.brand.libraries.items)
        ) {
            // Transform libraries into desired format
            return data.data.brand.libraries.items.map((library: { id: string; name: string }) => ({
                value: library.id,
                label: library.name,
            }));
        } else {
            console.error('Unexpected data format:', data);
            return [];
        }
    } catch (error) {
        console.error('Error fetching brand libraries:', error);
        return [];
    }
};

export const settings = defineSettings({
    main: [
        {
            id: 'brandDropdown',
            type: 'dropdown',
            defaultValue: 'None',
            size: DropdownSize.Large,
            disabled: false,
            choices: fetchBrands,
        },
        {
            id: 'librariesDropdown',
            type: 'dropdown',
            defaultValue: 'content_block',
            size: DropdownSize.Large,
            show: (bundle) => bundle.getBlock('brandDropdown')?.value !== 'None',
            choices: (bundle) => fetchLibraries(bundle),
        },
    ],
});

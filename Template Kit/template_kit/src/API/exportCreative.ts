import {
    type TemplateVariablesData,
    type TextVariable,
    type ImageVariable,
    type ColorVariable,
    type Variable,
    type CreativeTemplateResponse,
} from '../types';

const EXPORT_CREATIVE = `
mutation exportCreativeRendering($input: ExportCreativeInput!) {
    exportCreative(input: $input) {
        job {
          id,
          status,
        }
    }
  }
`;

type GraphQLResponse<T> = {
    data: T;
    errors?: Array<{ message: string }>;
};

export const fetchTemplateData = async (id: number): Promise<TemplateVariablesData> => {
    const endpoint = 'https://demo.frontify.com/graphql';
    const variables = { id };
    const token = 'Q2ydJqV3zbDxV4YNbdJ26uSJLKhkTKoPvz34xBhz';

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'x-frontify-beta': 'enabled',
        },
        body: JSON.stringify({
            query: GET_TEMPLATE_BY_ID,
            variables,
        }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const result: GraphQLResponse<CreativeTemplateResponse> =
        (await response.json()) as GraphQLResponse<CreativeTemplateResponse>;

    if (result.errors) {
        throw new Error(result.errors.map((error) => error.message).join(', '));
    }

    const { creativeTemplate } = result.data;

    if (!creativeTemplate || !creativeTemplate.variables) {
        throw new Error('Invalid response structure');
    }

    const templateData: TemplateVariablesData = {
        variables: creativeTemplate.variables
            .map((variable) => {
                if (variable.type === 'TEXT') {
                    return {
                        key: variable.key,
                        type: 'TEXT',
                        value: variable.value,
                    } as TextVariable;
                } else if (variable.type === 'IMAGE') {
                    return {
                        key: variable.key,
                        type: 'IMAGE',
                        value: variable.value,
                    } as ImageVariable;
                } else if (variable.type === 'COLOR') {
                    return {
                        key: variable.key,
                        type: 'COLOR',
                        value: variable.value,
                    } as ColorVariable;
                }
                return null;
            })
            .filter((variable: Variable | null): variable is Variable => variable !== null),
    };

    return templateData;
};

import {
    openTemplateChooser,
    type AppBridgeBlock,
    type TemplateLegacy,
    closeTemplateChooser,
} from '@frontify/app-bridge';
import { Button, ButtonEmphasis } from '@frontify/fondue';
import { type FC, useCallback, useEffect } from 'react';

import { fetchTemplateData } from '../../API/fetchVariables';
import { type TemplateData, type InputVar } from '../../types';

import { TemplateItem } from './TemplateItem';

type RenderTemplatesProps = {
    appBridge: AppBridgeBlock;
    selectedTemplates: TemplateData[];
    onAddTemplate: (template: TemplateData) => void;
    onDeleteTemplate: (id: number) => void;
    inputs: InputVar[];
    updateVariableMapping: (variableKey: string, inputId: string) => void;
};

export const RenderTemplates: FC<RenderTemplatesProps> = ({
    appBridge,
    selectedTemplates,
    onAddTemplate,
    onDeleteTemplate,
    inputs,
    updateVariableMapping,
}) => {
    const handleOpenTemplateChooser = () => appBridge.dispatch(openTemplateChooser());

    const onTemplateSelected = useCallback(
        async (result: { template: TemplateLegacy }) => {
            await appBridge.dispatch(closeTemplateChooser());
            const templateVariables = await fetchTemplateData(result.template.id);
            const templateData: TemplateData = { data: result.template, variables: templateVariables.variables };
            onAddTemplate(templateData);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [appBridge],
    );

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        const unsubscribeTemplateChooser = appBridge.subscribe('templateChosen', onTemplateSelected);

        return () => {
            if (typeof unsubscribeTemplateChooser === 'function') {
                unsubscribeTemplateChooser();
            }
        };
    }, [appBridge, onTemplateSelected]);

    return (
        <div>
            {selectedTemplates?.map((template) => (
                <TemplateItem
                    key={template.data.id}
                    template={template}
                    inputs={inputs}
                    onDeleteTemplate={onDeleteTemplate}
                    updateVariableMapping={updateVariableMapping}
                />
            ))}
            <Button emphasis={ButtonEmphasis.Strong} onClick={handleOpenTemplateChooser}>
                {'Add template'}
            </Button>
        </div>
    );
};

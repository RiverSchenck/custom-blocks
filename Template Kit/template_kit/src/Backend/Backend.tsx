import { type AppBridgeBlock } from '@frontify/app-bridge';
import { type FC } from 'react';

import { type InputVar, type TemplateData } from '../types';

import { RenderInputs } from './Input Section/RenderInputs';
import { RenderTemplates } from './Template Section/RenderTemplates';

type BackendComponentProps = {
    inputs: InputVar[];
    onAddInput: (input: InputVar) => void;
    onDeleteInput: (id: string) => void;
    selectedTemplates: TemplateData[];
    onAddTemplate: (template: TemplateData) => void;
    onDeleteTemplate: (id: number) => void;
    appBridge: AppBridgeBlock;
    updateVariableMapping: (variableKey: string, inputId: string) => void;
};

export const BackendComponent: FC<BackendComponentProps> = ({
    inputs,
    onAddInput,
    onDeleteInput,
    appBridge,
    selectedTemplates,
    onAddTemplate,
    onDeleteTemplate,
    updateVariableMapping,
}) => {
    return (
        <div>
            <RenderInputs inputs={inputs} onAddInput={onAddInput} onDeleteInput={onDeleteInput} />
            <RenderTemplates
                appBridge={appBridge}
                selectedTemplates={selectedTemplates}
                onAddTemplate={onAddTemplate}
                onDeleteTemplate={onDeleteTemplate}
                inputs={inputs}
                updateVariableMapping={updateVariableMapping}
            />
        </div>
    );
};

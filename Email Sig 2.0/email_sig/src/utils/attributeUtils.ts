import { SignatureInput } from "../types";

export const handleAttributeChange = (
    input: SignatureInput,
    key: string,
    newValue: any,
    onUpdate: (updatedInput: SignatureInput) => void
) => {
    const updatedInput = { ...input };
    
    // Split the attribute to handle nested fields
    const keys = key.split('.');
    if (keys.length === 2) {
        // Nested field (like content.value or content.locked)
        const [parent, child] = keys;
        (updatedInput as any)[parent][child] = newValue;
    } else {
        // Direct field (like name)
        (updatedInput as any)[key] = newValue;
    }
    
    onUpdate(updatedInput);
};

export const handleToggleLock = (
    input: SignatureInput,
    key: string,
    onUpdate: (updatedInput: SignatureInput) => void
) => {
    const updatedInput = { ...input };
    const [parent, child] = key.split('.');
    if (parent && child) {
        (updatedInput as any)[parent][child] = !(updatedInput as any)[parent][child];
        onUpdate(updatedInput);
    }
}; 
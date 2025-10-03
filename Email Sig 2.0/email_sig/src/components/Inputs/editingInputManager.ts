// components/InputManager.ts
import { useCallback, useState } from "react";
import { SignatureInput, TextInput, ImageInput, InputType } from "../../types"
import { SystemFonts } from "../../utils/systemFontsList";
import { defaultColor } from "../../utils/defaultColor";
import { debounce } from "lodash";

export const useEditingInputManager = (
  initialInputs: SignatureInput[],
  setBlockSettings: (settings: { savedInputs: SignatureInput[] }) => void
) => {
  const [inputs, setInputs] = useState<SignatureInput[]>(initialInputs);

  const debouncedSave = useCallback(
    debounce((newInputs: SignatureInput[]) => {
        setBlockSettings({ savedInputs: newInputs });
    }, 200),
    [setBlockSettings]
);

    const updateSettings = (newInputs: SignatureInput[]) => {
      setInputs(newInputs);              // Immediate for UI responsiveness
      debouncedSave(newInputs);
  };

  const addInput = (type: InputType): SignatureInput => {
    const newInput =
        type === InputType.Text ? createTextInput() : createImageInput();
    const updated = [...inputs, newInput];
    updateSettings(updated);
    return newInput;
};

const updateInput = (updatedInput: SignatureInput) => {
    const updated = inputs.map((input) =>
        input.id === updatedInput.id ? updatedInput : input
    );
    updateSettings(updated);
};

const deleteInput = (id: string) => {
    const updated = inputs.filter((input) => input.id !== id);
    updateSettings(updated);
};

const reorderInputs = (newOrder: SignatureInput[]) => {
    updateSettings(newOrder);
};

const createTextInput = (): TextInput => ({
    id: `text-input-${Date.now()}`,
    name: ``,
    type: InputType.Text,
    content: { value: "", locked: false },
    fontSize: { value: 12, locked: true },
    typeface: { value: SystemFonts[0], locked: true },
    lineHeight: 1.2,
    color: { value: defaultColor, locked: true, restrictedOptions: [] },
    visibility: { value: true, locked: true },
    bold: { value: false, locked: true },
    italic: { value: false, locked: true },
    underline: { value: false, locked: true },
});

const createImageInput = (): ImageInput => ({
    id: `image-input-${Date.now()}`,
    name: ``,
    type: InputType.Image,
    imageSelection: null,
    options: null,
    width: { value: 100, locked: true },
    url: { value: "", locked: true },
    visibility: { value: true, locked: true },
});

return {
    inputs,
    addInput,
    updateInput,
    deleteInput,
    reorderInputs,
};
};

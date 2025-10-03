// components/InputManager.ts
import { useState } from "react";
import { SignatureInput } from "../../types"

export const useViewInputManager = () => {
  const [viewInputs, setViewInputs] = useState<SignatureInput[]>([]);

  const updateViewInput = (updatedInput: SignatureInput) => {
    console.log(updatedInput)
    setViewInputs((prevInputs) =>
      prevInputs.map(input => input.id === updatedInput.id ? updatedInput : input)
    );

  };

  const syncViewInputs = (editingInputs: SignatureInput[]) => {
    const deepCloned = editingInputs.map((input) => JSON.parse(JSON.stringify(input)));
    setViewInputs(deepCloned);
};

  return {
    viewInputs,
    syncViewInputs,
    updateViewInput,
  };
};

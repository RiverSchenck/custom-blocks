import { Asset } from "@frontify/app-bridge";
import { Color } from "@frontify/guideline-blocks-settings";
import { Palette} from '@frontify/fondue';

export type Settings = {
  savedInputs: SignatureInput[]
}

export type SignatureInput = TextInput | ImageInput;

export enum InputType {
    Text = "text",
    Image = "image",
  }

type BaseInput = {
  id: string;
  name: string;
  type: InputType;
};

type LockableProperty<T> = {
  value: T;
  locked: boolean;
};

export type TextInput = BaseInput & {
  type: InputType.Text;
  content: LockableProperty<string>;
  fontSize: LockableProperty<number>;
  typeface: LockableProperty<string>;
  lineHeight: number;
  color: LockableProperty<Color> & {
    restrictedOptions?: Palette[];
  };
  visibility: LockableProperty<boolean>;
  bold: LockableProperty<boolean>;
  italic: LockableProperty<boolean>;
  underline: LockableProperty<boolean>;
};

export type ImageInput = BaseInput & {
  type: InputType.Image;
  imageSelection: Asset | null; // Currently selected asset ID
  selectionMode: ImageSelectionMode;
  restrictedLibraryId?: string;
  options: Asset[] | null;
  width: LockableProperty<number>;
  url: LockableProperty<string>;
  visibility: LockableProperty<boolean>;
};

export enum ImageSelectionMode {
  Suggested = "Suggested Assets",       // Editors provide asset suggestions
  LibraryRestricted = "Specific Library",   // Restrict selection to a specific library
  FreeChoice = "Free Choice",            // Allow any accessible asset
}

import styles from '../../styles';
import { ImageInputItem, InputItem } from '../../types';
import InputFlyouts from './InputFlyouts';
import { onOpenAssetChooser } from '../../components/Inputs/ImageInput';
import { AssetInput, AssetInputSize } from '@frontify/fondue';
import { AppBridgeBlock } from '@frontify/app-bridge';
import ImageCarousel from '../ImageCarousel';

interface ImageInputContainerProps {
    input: ImageInputItem;
    inputs: InputItem[];
    index: number;
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>;
    appBridge: AppBridgeBlock;
}

const ImageInputContainer = ({ input, inputs, index, setInputs, appBridge }: ImageInputContainerProps) => {
    return (
        <div style={styles.imageInputContainer}>
            <div style={styles.inputTypeContainer}>
                <div style={styles.innerTypeContainer}>Image</div>
                <div style={styles.flyoutIndividual}>
                    <InputFlyouts input={input} index={index} inputs={inputs} setInputs={setInputs} />
                </div>
            </div>
            <div style={{ border: '1px solid #d3d3d3' }}>
                <div>
                    <ImageCarousel specificInput={input} inputs={inputs} setInputs={setInputs} isFrontend={false} />
                </div>
                {input.images.length < 5 && (
                    <div style={styles.assetInputWrapper}>
                        <AssetInput
                            numberOfLocations={1}
                            size={AssetInputSize.Large}
                            onLibraryClick={() => onOpenAssetChooser(input.id, appBridge, inputs, setInputs)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageInputContainer;

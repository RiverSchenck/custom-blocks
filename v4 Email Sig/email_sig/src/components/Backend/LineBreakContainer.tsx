import styles from '../../styles';
import { InputItem } from '../../types';
import InputFlyouts from './InputFlyouts';

interface LineBreakContainerProps {
    input: InputItem;
    inputs: InputItem[];
    index: number;
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>;
}

const LineBreakContainer = ({ input, inputs, index, setInputs }: LineBreakContainerProps) => {
    return (
        <div style={styles.lineBreakContainer}>
            <div style={styles.flyoutIndividual}>
                <InputFlyouts input={input} index={index} inputs={inputs} setInputs={setInputs} />
            </div>
            <div style={styles.lineBreakText}>Line Break</div>
        </div>
    );
};

export default LineBreakContainer;

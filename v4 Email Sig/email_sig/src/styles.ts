import { CSSProperties } from 'react';
import styled, { keyframes } from 'styled-components';

// Define a type for your styles
type Styles = {
    [key: string]: CSSProperties;
};

// Define your styles
export const styles: Styles = {
    noFormNoticeContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#f4f4f4',
        borderRadius: '20px',
        color: '#333',
        fontFamily: 'Arial, sans-serif',
    },
    noFormNoticeHeading: {
        fontSize: '30px',
        fontWeight: 'bold',
    },
    noFormNoticeSubheading: {
        fontSize: '22px',
    },
    noFormNoticeInstructions: {
        fontSize: '18px',
    },
    backendInputsContainer: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    frontendInputs: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        width: '100%',
    },
    inputsContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: '10px',
        maxWidth: '92%',
    },
    inputTypeContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: '5px 5px 0 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    innerTypeContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    innerTypetextContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flex: 1,
        height: '22px',
    },
    flyoutContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        flex: '0 0 auto',
        width: '20px',
    },
    imageInputContainer: {
        marginTop: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
    },
    assetInputWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        height: '100%',
        width: '100%',
    },
    imageWidthInput: {
        padding: '10px',
        fontSize: '12px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        width: '100%',
        boxSizing: 'border-box',
        marginTop: '10px',
    },
    flyoutIndividual: {
        display: 'flex',
        alignSelf: 'flex-end',
    },

    lineBreakContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Space between children
        backgroundColor: '#F0F0F0',
        paddingBottom: '10px',
        borderRadius: '5px',
        width: '100%',
    },

    lineBreakText: {
        textAlign: 'center', // This should center the text
        marginTop: '-12px',
    },
};

export const fadeInOut = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

export const FadeInOutDiv = styled.div`
    animation: ${fadeInOut} 1.5s linear forwards;
`;

export default styles;

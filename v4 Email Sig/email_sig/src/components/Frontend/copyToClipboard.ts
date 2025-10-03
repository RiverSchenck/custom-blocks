export const handleCopyToClipboard = async (
    copyTableId: string,
    setCopyStatus: React.Dispatch<React.SetStateAction<string>>
) => {
    const tableElement = document.getElementById(copyTableId);
    if (tableElement) {
        const tableHTML = tableElement.innerHTML;
        // Simplify replacing paragraph tags with line breaks
        const updatedHTML = tableHTML.replaceAll(/<p>/gi, '').replaceAll(/<\/p>/gi, '<br/>');
        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': new Blob([updatedHTML], { type: 'text/html' }),
                }),
            ]);
            setCopyStatus('success');
        } catch (error) {
            console.error('Failed to copy text: ', error);
            setCopyStatus('failure');
        }
        // Reset status after 3 seconds.
        setTimeout(() => setCopyStatus('idle'), 1500);
    }
};

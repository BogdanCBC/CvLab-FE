    function getFileNameFromDisposition(disposition) {
        let filename = 'cv.pdf';
        if (disposition && disposition.includes('filename=')) {
            const match = disposition.match(/filename="?([^"]+)"?/);
            if (match && match[1]) {
                filename = match[1];
            }
        }
        return filename;
    }

    function downloadFileFromBlob(blob, filename) {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();

            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
    }

export {getFileNameFromDisposition, downloadFileFromBlob}
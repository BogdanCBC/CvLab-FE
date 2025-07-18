import api from "./api";

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

    async function downloadGeneratedFile(candidateId, fileType = 'pdf', fallbackFileName = 'cv_output.pdf') {
        try {
            const res = await api.get(`/cv/generate`, {
                params: {
                    candidate_id: candidateId,
                    file_type: fileType,
                },
                responseType: 'blob',
            });

            const disposition = res.headers['content-disposition'];
            const fileName = getFileNameFromDisposition(disposition) || fallbackFileName;

            downloadFileFromBlob(res.data, fileName);
        } catch (error) {
            console.error(`Failed to download file for candidate ${candidateId}`, error);
            throw error;
        }
    }

export {getFileNameFromDisposition, downloadFileFromBlob, downloadGeneratedFile}
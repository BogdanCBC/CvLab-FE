import api from "../api";

export async function fetchJobDescription(language, clientId) {
    const token = localStorage.getItem('token');
    if (!token) return [];

    const langMap = {
        'en': 'English',
        'fr': 'French'
    };

    let url = "/job-description";
    let params;

    if (clientId) {
        url = "/clients/jobs";
        params = { client_id: clientId, language: langMap[language] || 'English' };
    } else if (language) {
        params = { language: langMap[language] || 'English' };
    }

    try{
        const response = await api.get(url, { params });
        if (response.data.success) {
            const jobs = response.data.data.map(job => ({
                job_id: job.job_id,
                title: job.title,
                description: job.description,
                skills: job.skills
            }));
            const data = {
                success: response.data.success,
                jobs
            }
            // console.log(data)
            return data;
        }
    } catch (error) {
        const error_response = {
            success: error.response?.data?.success || false,
            jobs: [],
            message: error.response?.data?.message || "Unknown error"
        };
        return error_response;
    }
}
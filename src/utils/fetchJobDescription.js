import api from "../api";

export async function fetchJobDescription(language) {
    const token = localStorage.getItem('token');
    if (!token) return [];

    let url = "/job-description";
    if (language) {
        const langMap = {
            'en': 'English',
            'fr': 'French'
        };
        const mappedLang = langMap[language] || 'English';
        url += `?language=${mappedLang}`;
    }

    try{
        const response = await api.get(url);
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
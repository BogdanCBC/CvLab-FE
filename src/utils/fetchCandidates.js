import api from "../api";

export async function fetchCandidates(language) {
    const token = localStorage.getItem('token');
    if (!token) return [];

    let url = "/candidates";

    if (language) {
        const langMap = {
            'en': 'English',
            'fr': 'French'
        };
        // Default to English
        const mappedLang = langMap[language] || 'English';
        url += `?language=${mappedLang}`;
    }

    try {
        const response = await api.get(url);
        const data = response.data.map(candidate => ({
            id: candidate.id,
            firstName: candidate.first_name,
            lastName: candidate.last_name,
            experience: candidate.experience,
            position: candidate.position,
            language: candidate.language,
        }));
        // console.log(data);
        return data.sort((a, b) => b.id - a.id);
    } catch (error) {
        console.error("Error fetching candidates:", error);
        return [];
    }
}
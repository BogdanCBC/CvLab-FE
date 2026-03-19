import api from "../api";

export async function fetchCandidates(language) {
    const token = localStorage.getItem('token');
    if (!token) return [];

    try {
        const currentLang = language?.startsWith('fr') ? 'French' : 'English';

        const response = await api.get('/candidates', {
            params: {
                language: currentLang,
                skip: 0,
                limit: 10
            }
        });

        const rawData = response.data.items || response.data;

        const data = rawData.map(candidate => ({
            id: candidate.id,
            firstName: candidate.first_name || candidate.firstName,
            lastName: candidate.last_name || candidate.lastName,
            experience: candidate.experience,
            position: candidate.position,
            language: candidate.language,
        }));

        return data.sort((a, b) => b.id - a.id);
    } catch (error) {
        console.error("Error fetching candidates:", error);
        return [];
    }
}
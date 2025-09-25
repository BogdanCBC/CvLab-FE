import api from "../api";

export async function fetchCandidates() {
    const token = localStorage.getItem('token');
    if (!token) return [];
    try {
        const response = await api.get("/candidates");
        const data = response.data.map(candidate => ({
            id: candidate.id,
            firstName: candidate.first_name,
            lastName: candidate.last_name,
            experience: candidate.experience,
            position: candidate.position,
            language: candidate.language,
        }));
        // console.log(data);
        const sorted = data.sort((a, b) => b.id - a.id);
        return sorted;
    } catch (error) {
        console.error("Error fetching candidates:", error);
        return [];
    }
}
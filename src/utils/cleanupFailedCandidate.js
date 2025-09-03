import api from "../api";

export async function cleanupFailedCandidate(candidateId) {
    if (!candidateId) return;

    try {
        await api.delete(`/candidates`, {
            params: { id: candidateId },
        });
        console.log(`Cleaned up candidate id: ${candidateId}`);
    } catch (err) {
        console.log(`Failed cleanup for candidate ${candidateId}`, err);
    }
}
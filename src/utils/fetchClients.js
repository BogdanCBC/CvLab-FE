import api from "../api";

export async function fetchClients() {
    const token = localStorage.getItem('token');
    if (!token) return [];

    try {
        const response = await api.get("/clients");
        if (response.data) {
            const clients = Array.isArray(response.data) ? response.data : (response.data.data || []);
            return {
                success: true,
                clients
            };
        }
    } catch (error) {
        return {
            success: error.response?.data?.success || false,
            clients: [],
            message: error.response?.data?.message || "Unknown error"
        };
    }
}

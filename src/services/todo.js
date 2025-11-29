const API_URL = '/api/todos';

export const todoService = {
    async getAll() {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch todos');
        return res.json();
    },

    async create(text) {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });
        if (!res.ok) throw new Error('Failed to create todo');
        return res.json();
    },

    async update(id, updates) {
        const res = await fetch(`${API_URL}?id=${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error('Failed to update todo');
        return res.json();
    },

    async delete(id) {
        const res = await fetch(`${API_URL}?id=${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete todo');
        return res.json();
    },

    async updateOrder(todos) {
        const res = await fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ todos }),
        });
        if (!res.ok) throw new Error('Failed to update order');
        return res.json();
    }
};

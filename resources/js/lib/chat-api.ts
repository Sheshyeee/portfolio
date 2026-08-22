export type ChatRole = 'user' | 'model';

export type ChatTurn = {
    role: ChatRole;
    content: string;
};

function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
}

export async function sendChatMessage(message: string, history: ChatTurn[]): Promise<string> {
    const xsrfToken = getCookie('XSRF-TOKEN');

    const response = await fetch('/api/chat', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
        },
        body: JSON.stringify({ message, history: history.slice(-16) }),
    });

    if (!response.ok) {
        throw new Error(`Chat request failed with status ${response.status}`);
    }

    const data = await response.json();
    return typeof data.reply === 'string' ? data.reply : 'Sorry, something went wrong on my end.';
}

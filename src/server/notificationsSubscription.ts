import type { TNotification } from '@/types/Notification'

export function startWS(
    onMessage: (notification: TNotification) => void,
    url: string
) {
    const ws = new WebSocket(url)

    ws.addEventListener('open', () => console.log('[WS] Connected'))
    ws.addEventListener('message', (ev) => {
        try {
            const data = JSON.parse(ev.data as string) as TNotification
            onMessage(data)
        } catch (e) {
            console.warn('[WS] Error parsing message:', e)
        }
    })
    ws.addEventListener('close', () => console.log('[WS] Closed'))
    ws.addEventListener('error', (e) => console.error('[WS] Error', e))

    return () => ws.close(1000, 'manual close') // cleanup function
}

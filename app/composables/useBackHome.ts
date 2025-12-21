import type {Router} from "#vue-router";

export const useBackHome = (router: Router, timeout: number) => {
    let timeout_id: number|null = null;
    const refresh_timer = () => {
        if (timeout_id !== null) {
            clearTimeout(timeout_id)
        }
        timeout_id = setTimeout(async () => {
            await router.push("/")
        }, timeout)
    }
    const clear_timer = () => {
        if (timeout_id !== null) {
            clearTimeout(timeout_id)
        }
    }
    refresh_timer()
    onUnmounted(clear_timer)
    return { refresh_timer, clear_timer }
}
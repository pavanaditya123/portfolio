import { useState, useEffect, useCallback, useRef } from 'react';
import { getStats, SOFT_TTL } from '../lib/codingStats';

/**
 * Load one platform's stats.
 *
 * status is 'disabled' when no handle is configured, which lets a card decide
 * not to render at all instead of showing a broken placeholder.
 * `nonce` is a caller-controlled counter -- bumping it forces a live refetch,
 * bypassing the cache.
 */
export default function useCodingStats(platform, handle, nonce = 0) {
    const [state, setState] = useState({
        status: handle ? 'loading' : 'disabled',
        data: null,
        stale: false,
        fetchedAt: null,
    });

    const alive = useRef(true);
    useEffect(() => {
        alive.current = true;
        return () => {
            alive.current = false;
        };
    }, []);

    const load = useCallback(
        async (force) => {
            if (!handle) {
                setState({ status: 'disabled', data: null, stale: false, fetchedAt: null });
                return;
            }
            setState((s) => ({ ...s, status: s.data ? 'refreshing' : 'loading' }));
            try {
                const { data, stale, fetchedAt } = await getStats(platform, handle, { force });
                if (!alive.current) return;
                setState({ status: 'ready', data, stale, fetchedAt });

                // Stale-while-revalidate. The cache makes the page render
                // instantly, but a visitor comparing against the real profile
                // should not be looking at numbers hours old, so anything past
                // the soft window is refreshed in the background and swapped in
                // when it lands.
                if (!force && Date.now() - fetchedAt > SOFT_TTL) {
                    getStats(platform, handle, { force: true })
                        .then((fresh) => {
                            if (!alive.current) return;
                            setState({
                                status: 'ready',
                                data: fresh.data,
                                stale: fresh.stale,
                                fetchedAt: fresh.fetchedAt,
                            });
                        })
                        .catch(() => {
                            // The cached values are already on screen; a failed
                            // background refresh should change nothing.
                        });
                }
            } catch {
                if (!alive.current) return;
                setState({ status: 'error', data: null, stale: false, fetchedAt: null });
            }
        },
        [platform, handle],
    );

    useEffect(() => {
        // Kicking off the fetch on mount is exactly what this effect is for.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        load(nonce > 0);
    }, [load, nonce]);

    return { ...state, refresh: () => load(true) };
}

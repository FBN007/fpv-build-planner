import { useEffect, useState } from 'react';

import { useProjectStore } from './projectStore';

/**
 * AsyncStorage loads asynchronously, so the store starts empty for a moment.
 * Gate screens on this to avoid flashing the empty state on launch.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => useProjectStore.persist.hasHydrated());

  useEffect(() => {
    const unsubscribe = useProjectStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useProjectStore.persist.hasHydrated());
    return unsubscribe;
  }, []);

  return hydrated;
}

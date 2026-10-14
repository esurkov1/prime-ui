import { Icon } from "prime-ui-kit";

// Знак, который следует за состоянием: drawn прорисовывает штрих при true и стирает при false.
export function SyncedMark({ synced }: { synced: boolean }) {
  return <Icon name="action.check" drawn={synced} />;
}

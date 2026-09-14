import type { Language } from '@/content/types';
import { LabelledList } from './labelled-list';

/**
 * The languages the owner speaks, in the order the content gives, per DDR-006: one row per
 * language, labelled by the language, with its level as the value.
 */
export function Languages({ languages }: { languages: readonly Language[] }) {
  return <LabelledList rows={languages.map(({ name, level }) => ({ label: name, value: level }))} />;
}

import { useState } from 'react';
import type { Card } from '../../lib/srs.mjs';
import { illustrationFor } from '../../lib/vocab-illustrations.mjs';
import { vocabImageUrl } from '../lib/offlineImages';

/** Only mounted on the revealed answer; a failed image never blocks study. */
export function VocabIllustration({ card }: { card: Card }) {
  const [failed, setFailed] = useState(false);
  // Genshin voice cards are text/audio only, including previously illustrated cards.
  const image = card.id.startsWith('game-card:game:genshin:')
    ? undefined
    : illustrationFor(card);
  if (!image || failed) return null;
  return (
    <img
      className="vocab-illustration"
      src={vocabImageUrl(image.src)}
      // The adjacent answer already supplies the meaning; this image is decorative.
      alt=""
      width={224}
      height={168}
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}

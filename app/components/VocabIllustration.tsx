import { useState } from 'react';
import type { Card } from '../../lib/srs.mjs';
import { illustrationFor } from '../../lib/vocab-illustrations.mjs';

/** Only mounted on the revealed answer; a failed image never blocks study. */
export function VocabIllustration({ card }: { card: Card }) {
  const [failed, setFailed] = useState(false);
  const image = illustrationFor(card);
  if (!image || failed) return null;
  return (
    <img
      className="vocab-illustration"
      src={`${import.meta.env.BASE_URL}${image.src}`}
      // The adjacent answer already supplies the meaning; this image is decorative.
      alt=""
      width={224}
      height={168}
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}

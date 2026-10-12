"""Extract installed Japanese Eternal Return character-selection clips into .cache only."""
import argparse
import hashlib
import json
import re
import sys
import time
from pathlib import Path

REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
CACHE_ROOT = REPOSITORY_ROOT / '.cache'
VOICE_ROOT = 'Assets/Addressables/Sound/VOICE/'
SELECTION_EVENT = re.compile(r'_selected2?(?:_|$)', re.IGNORECASE)
SAFE_COMPONENT = re.compile(r'^[A-Za-z0-9_-]+$')


def selection_asset_key(key: str) -> bool:
    """Accept only Japanese WAV assets whose clip stem contains a selection event."""
    if not isinstance(key, str) or not key.startswith(VOICE_ROOT):
        return False
    parts = key.split('/')
    if len(parts) != 8 or parts[6] != 'ja' or not parts[7].endswith('_ja.wav'):
        return False
    return bool(SELECTION_EVENT.search(parts[7][:-7]))


def record_filename(key: str) -> str:
    parts = key.split('/')
    character, skin = parts[4], parts[5]
    clip = parts[7][:-7]
    if not all(SAFE_COMPONENT.fullmatch(value) for value in (character, skin, clip)):
        raise ValueError('Unsafe asset-key component')
    return f'{character}-{skin}-{clip}.wav'


def extract_selection(asset_root: Path, output: Path) -> dict:
    """Match catalog keys to Unity containers and preserve original-audio hashes."""
    from addressablestools import parse_binary
    import UnityPy

    asset_root = asset_root.resolve()
    output = output.resolve()
    if not output.is_relative_to(CACHE_ROOT.resolve()) or output == CACHE_ROOT.resolve():
        raise ValueError('Output must be a new subdirectory inside repository .cache')
    if output.exists():
        raise ValueError('Output already exists; use a new directory to prevent overwriting evidence')

    started = time.perf_counter()
    catalog_bytes = (asset_root / 'catalog.bin').read_bytes()
    catalog = parse_binary(catalog_bytes)
    assets: dict[str, str] = {}
    for key, locations in catalog.resources.items():
        if not selection_asset_key(key):
            continue
        if len(locations) != 1:
            raise ValueError('Ambiguous catalog location')
        dependencies = locations[0].dependencies or []
        bundles = [
            location.internal_id.replace('\\', '/').rsplit('/', 1)[-1]
            for location in dependencies
            if location.internal_id.endswith('.bundle')
        ]
        if len(bundles) != 1:
            raise ValueError('Ambiguous bundle dependency')
        assets[key] = bundles[0]
    if not assets:
        raise ValueError('No Japanese selection clips in installed catalog')

    output.mkdir(parents=True)
    records = []
    matched: set[str] = set()
    for bundle_name in sorted(set(assets.values())):
        bundle_path = asset_root / 'Addressables' / bundle_name
        bundle_hash = hashlib.sha256(bundle_path.read_bytes()).hexdigest()
        environment = UnityPy.load(str(bundle_path))
        for key, reader in environment.container.items():
            if assets.get(key) != bundle_name:
                continue
            if key in matched or reader.type.name != 'AudioClip':
                raise ValueError('Duplicate or non-audio catalog asset')
            clip = reader.read()
            samples = clip.samples
            if len(samples) != 1:
                raise ValueError('Ambiguous audio samples')
            _, data = next(iter(samples.items()))
            filename = record_filename(key)
            with (output / filename).open('xb') as destination:
                destination.write(data)
            parts = key.split('/')
            records.append({
                'asset_key': key,
                'character_asset_name': parts[4],
                'skin_folder': parts[5],
                'clip': parts[7][:-7],
                'file': filename,
                'bundle': bundle_name,
                'bundle_sha256': bundle_hash,
                'sha256': hashlib.sha256(data).hexdigest(),
                'duration': clip.m_Length,
                'channels': clip.m_Channels,
                'frequency': clip.m_Frequency,
            })
            matched.add(key)
    if matched != set(assets):
        raise ValueError('Catalog and bundle containers do not match; partial output is unverified')

    report = {
        'catalog_sha256': hashlib.sha256(catalog_bytes).hexdigest(),
        'scope': 'all installed Japanese character-selection filename candidates',
        'count': len(records),
        'bundle_count': len(set(assets.values())),
        'elapsed_seconds': round(time.perf_counter() - started, 3),
        'records': sorted(records, key=lambda record: record['asset_key']),
    }
    (output / 'manifest.json').write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8'
    )
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--asset-root', required=True, type=Path, help='Installed StreamingAssets/aa directory')
    parser.add_argument('--out', required=True, type=Path, help='New directory under repository .cache')
    args = parser.parse_args()
    try:
        report = extract_selection(args.asset_root, args.out)
    except (ImportError, OSError, ValueError):
        print('Extraction failed; check dependencies, asset keys, and local paths.', file=sys.stderr)
        return 1
    print(json.dumps({
        'count': report['count'],
        'bundle_count': report['bundle_count'],
        'seconds': report['elapsed_seconds'],
    }))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

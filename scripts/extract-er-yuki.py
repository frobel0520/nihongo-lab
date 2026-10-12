"""Read installed ER Yuki default Japanese clips; never publish original audio."""
import argparse
import hashlib
import json
import sys
import time
from pathlib import Path

REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
CACHE_ROOT = REPOSITORY_ROOT / '.cache'
ASSET_PREFIX = 'Assets/Addressables/Sound/VOICE/Yuki/S000/ja/'


def extract_yuki(asset_root: Path, output: Path) -> dict:
    """Match catalog keys to container objects and preserve exact audio identity."""
    from addressablestools import parse_binary
    import UnityPy

    output = output.resolve()
    if not output.is_relative_to(CACHE_ROOT.resolve()) or output == CACHE_ROOT.resolve():
        raise ValueError('Output must be a new subdirectory inside repository .cache')
    if output.exists():
        raise ValueError('Output already exists; use a new directory to prevent overwriting evidence')
    started = time.perf_counter()
    catalog_bytes = (asset_root / 'catalog.bin').read_bytes()
    catalog = parse_binary(catalog_bytes)
    assets = {}
    for key, locations in catalog.resources.items():
        if not isinstance(key, str) or not key.startswith(ASSET_PREFIX) or not key.endswith('_ja.wav'):
            continue
        if len(locations) != 1:
            raise ValueError('Ambiguous asset location: ' + key)
        dependencies = locations[0].dependencies or []
        bundles = [location.internal_id.replace('\\', '/').rsplit('/', 1)[-1]
                   for location in dependencies if location.internal_id.endswith('.bundle')]
        if len(bundles) != 1:
            raise ValueError('Ambiguous bundle dependency: ' + key)
        assets[key] = bundles[0]
    if not assets:
        raise ValueError('No Yuki S000 Japanese clips in installed catalog')
    output.mkdir(parents=True)
    records = []
    matched = set()
    for bundle_name in sorted(set(assets.values())):
        bundle_path = asset_root / 'Addressables' / bundle_name
        bundle_hash = hashlib.sha256(bundle_path.read_bytes()).hexdigest()
        environment = UnityPy.load(str(bundle_path))
        for key, reader in environment.container.items():
            if assets.get(key) != bundle_name:
                continue
            if key in matched or reader.type.name != 'AudioClip':
                raise ValueError('Duplicate or non-audio asset: ' + key)
            clip = reader.read()
            samples = clip.samples
            if len(samples) != 1:
                raise ValueError('Ambiguous audio samples: ' + key)
            filename, data = next(iter(samples.items()))
            filename = Path(filename).name
            with (output / filename).open('xb') as destination:
                destination.write(data)
            records.append({
                'asset_key': key, 'path_id': reader.path_id, 'clip': clip.m_Name,
                'file': filename, 'bundle': bundle_name, 'bundle_sha256': bundle_hash,
                'sha256': hashlib.sha256(data).hexdigest(), 'duration': clip.m_Length,
                'channels': clip.m_Channels, 'frequency': clip.m_Frequency,
                'transcript': None, 'transcript_status': 'pending',
                'trigger': None, 'trigger_status': 'pending',
            })
            matched.add(key)
    if matched != set(assets):
        raise ValueError('Catalog and bundle containers do not match; partial output is not verified')
    report = {
        'catalog_sha256': hashlib.sha256(catalog_bytes).hexdigest(),
        'scope': 'Yuki/S000/ja', 'count': len(records),
        'elapsed_seconds': round(time.perf_counter() - started, 3),
        'records': sorted(records, key=lambda record: record['asset_key']),
    }
    (output / 'manifest.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--asset-root', required=True, type=Path, help='Installed StreamingAssets/aa directory')
    parser.add_argument('--out', required=True, type=Path, help='New directory under repository .cache')
    args = parser.parse_args()
    try:
        report = extract_yuki(args.asset_root, args.out)
    except (ImportError, OSError, ValueError) as error:
        # Avoid leaking machine-specific paths from OS and third-party exceptions.
        if isinstance(error, ValueError):
            print(str(error), file=sys.stderr)
        else:
            print(type(error).__name__ + ': extraction failed; check dependencies and local paths', file=sys.stderr)
        return 1
    print(json.dumps({'count': report['count'], 'seconds': report['elapsed_seconds']}))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

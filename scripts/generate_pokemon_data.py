#!/usr/bin/env python3
"""
Generate Pokemon data file from game list and PokeAPI.

Usage: python scripts/generate_pokemon_data.py <input_file> <output_file>

Example: python scripts/generate_pokemon_data.py pokemon_list.txt src/data/pokemon-data.ts
"""

import json
import sys
import time
import urllib.request
import urllib.error
import urllib.parse
from pathlib import Path


def get_pokemon_data(name: str) -> tuple[list[str], int]:
    """
    Fetch Pokemon types and national dex number from PokeAPI.

    Returns: (types, national_dex_number)
    """
    # Normalize name for API
    api_name = name.lower().replace('\'', '').replace(' ', '-').replace('.', '-')

    # Special cases for API names
    name_mappings = {
        'Farfetchd': 'farfetchd',
        'Sirfetchd': 'sirfetchd',
        'Mime-Jr': 'mime-jr',
        'Mr-Mime': 'mr-mime',
        'Mr-Rime': 'mr-rime',
        'Porygon-Z': 'porygon-z',
        'Type-Null': 'type-null',
        'Tapu-Koko': 'tapu-koko',
        'Tapu-Lele': 'tapu-lele',
        'Tapu-Bulu': 'tapu-bulu',
        'Tapu-Fini': 'tapu-fini',
        'Ho-Oh': 'ho-oh',
        'PorygonZ': 'porygon-z',
    }

    if name in name_mappings:
        api_name = name_mappings[name]

    try:
        url = f'https://pokeapi.co/api/v2/pokemon/{urllib.parse.quote(api_name)}'
        with urllib.request.urlopen(url, timeout=5) as response:
            data = json.loads(response.read())
            types = [t['type']['name'].title() for t in data['types']]
            national_dex = data['id']
            return types, national_dex
    except (urllib.error.URLError, json.JSONDecodeError, KeyError) as e:
        print(f"Warning: Could not fetch data for {name}: {e}")
        return ['Unknown'], 1


def parse_pokemon_list(input_file: str) -> list[dict]:
    """
    Parse Pokemon list from text file.

    Format: "NUMBER\tNAME" (e.g., "001\tChikorita")
    """
    pokemon_list = []

    with open(input_file, 'r') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue

            parts = line.split('\t')
            if len(parts) >= 2:
                local_number = int(parts[0])
                name = parts[1]

                print(f"Fetching data for {name}...", end=' ')
                types, national_dex = get_pokemon_data(name)
                print(f"{' / '.join(types)} (National: #{national_dex})")

                # Small delay to avoid rate limiting
                time.sleep(0.1)

                pokemon_list.append({
                    'id': local_number,
                    'name': name,
                    'number': f'{local_number:03d}',
                    'regionalNumber': national_dex,  # National Pokedex number
                    'classification': '1',  # Default stage
                    'types': types,
                    'image': f'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{national_dex}.png'
                })

    return pokemon_list


def generate_typescript(pokemon_list: list[dict]) -> str:
    """Generate TypeScript code from Pokemon data."""
    lines = ['export const POKEMON_DATA = [']

    for pokemon in pokemon_list:
        types_str = str(pokemon['types']).replace("'", "'")
        lines.append(f'  {{')
        lines.append(f"    id: {pokemon['id']},")
        lines.append(f"    name: '{pokemon['name']}',")
        lines.append(f"    number: '{pokemon['number']}',")
        lines.append(f"    regionalNumber: {pokemon['regionalNumber']},")
        lines.append(f"    classification: '{pokemon['classification']}',")
        lines.append(f'    types: {types_str},')
        lines.append(f"    image: '{pokemon['image']}'")
        lines.append(f'  }},')

    lines.append(']')
    return '\n'.join(lines)


def main():
    if len(sys.argv) < 2:
        print("Usage: python generate_pokemon_data.py <input_file> [output_file]")
        print("Default output: src/data/pokemon-data.ts")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'src/data/pokemon-data.ts'

    print(f"Parsing {input_file}...")
    pokemon_list = parse_pokemon_list(input_file)
    print(f"Found {len(pokemon_list)} Pokemon entries")

    print(f"Generating {output_file}...")
    typescript_content = generate_typescript(pokemon_list)

    # Ensure output directory exists
    Path(output_file).parent.mkdir(parents=True, exist_ok=True)

    with open(output_file, 'w') as f:
        f.write(typescript_content)

    print("Done!")


if __name__ == '__main__':
    main()

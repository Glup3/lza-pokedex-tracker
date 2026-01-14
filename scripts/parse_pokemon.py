#!/usr/bin/env python3
"""
Parse Pokemon data from personal.txt and generate TypeScript data file.

Usage: python scripts/parse_pokemon.py <input_file> <output_file>

Example: python scripts/parse_pokemon.py personal.txt src/data/pokemon-data.ts
"""

import re
import sys
from pathlib import Path


def parse_pokemon_data(input_file: str) -> list[dict]:
    """
    Parse Pokemon data from the personal.txt file.

    File format:
    ======
    001 - Bulbasaur #148 (Stage: 1)
    ======
    Base Stats: ...
    Type: Grass / Poison
    ...

    Args:
        input_file: Path to the personal.txt file

    Returns:
        List of Pokemon dictionaries with id, name, number, regionalNumber, types, image, classification
    """
    pokemon_list = []
    current_entry = {}

    # Pattern to match Pokemon entry line (e.g., "001 - Bulbasaur #148 (Stage: 1)")
    pokemon_entry_pattern = re.compile(r'^(\d+) - (.+?) #(\d+).*\(Stage: (\d+)\)')
    type_pattern = re.compile(r'^Type: (.+)')

    with open(input_file, 'r') as f:
        for line in f:
            line = line.strip()

            # Check for Pokemon entry line
            match = pokemon_entry_pattern.match(line)
            if match:
                local_number = int(match.group(1))
                name = match.group(2)
                regional_number = int(match.group(3))
                stage = match.group(4)

                current_entry = {
                    'id': local_number,  # Use local number as id
                    'name': name,
                    'number': f'{local_number:03d}',  # Zero-padded string
                    'regionalNumber': regional_number,
                    'classification': stage,  # Stage: 1, 2, 3, etc.
                    'types': [],
                    'image': f'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{local_number}.png'
                }
                continue

            # Check for Type line
            type_match = type_pattern.match(line)
            if type_match and current_entry:
                types_str = type_match.group(1)
                # Handle both single and dual types
                if ' / ' in types_str:
                    types = [t.strip() for t in types_str.split(' / ')]
                else:
                    types = [types_str.strip()]
                current_entry['types'] = types

                # Only add to list if we have all required fields
                if current_entry.get('id'):
                    pokemon_list.append(current_entry)
                current_entry = {}

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
        print("Usage: python parse_pokemon.py <input_file> [output_file]")
        print("Default output: src/data/pokemon-data.ts")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'src/data/pokemon-data.ts'

    print(f"Parsing {input_file}...")
    pokemon_list = parse_pokemon_data(input_file)
    print(f"Found {len(pokemon_list)} Pokemon entries (all forms)")

    print(f"Generating {output_file}...")
    typescript_content = generate_typescript(pokemon_list)

    # Ensure output directory exists
    Path(output_file).parent.mkdir(parents=True, exist_ok=True)

    with open(output_file, 'w') as f:
        f.write(typescript_content)

    print("Done!")


if __name__ == '__main__':
    main()

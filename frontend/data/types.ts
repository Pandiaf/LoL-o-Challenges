export interface TypeItem {
  id: number;
  type: string;
  label_fr: string;
  label_en: string;
  players_number: string;
}

export const types: TypeItem[] = [
  {
    "id": 1,
    "type": "Global_Spell",
    "label_fr": "Champions avec des compétences globales",
    "label_en": "Champs with Global Abilities",
    "players_number": "3+"
  },
  {
    "id": 2,
    "type": "Large_Spell",
    "label_fr": "Champions avec un ultime à large zone d'effets",
    "label_en": "Champs with large AOE ult",
    "players_number": "3+"
  },
  {
    "id": 3,
    "type": "Heal_Shield_Champ",
    "label_fr": "Champions à boucliers ou soins",
    "label_en": "Champs with heals or shields",
    "players_number": "3+"
  },
  {
    "id": 4,
    "type": "Above_Death_Champ",
    "label_fr": "Champions qui défient la mort",
    "label_en": "Champs that defy death",
    "players_number": "3+"
  },
  {
    "id": 5,
    "type": "Invisi_Champ",
    "label_fr": "Champions invisibles / furtifs",
    "label_en": "Champs with stealth",
    "players_number": "3+"
  },
  {
    "id": 6,
    "type": "Poke_Champ",
    "label_fr": "Champions qui \"pokent\"",
    "label_en": "Poke Champs",
    "players_number": "3+"
  },
  {
    "id": 7,
    "type": "Pet_Champ",
    "label_fr": "Champions qui invoquent",
    "label_en": "Champs with summon or pet",
    "players_number": "5"
  },
  {
    "id": 8,
    "type": "Move_Spell",
    "label_fr": "Champions qui restreignent les déplacements",
    "label_en": "Champs with displacements",
    "players_number": "3+"
  },
  {
    "id": 9,
    "type": "Trap_Spell",
    "label_fr": "Champions qui posent des pièges",
    "label_en": "Champs with traps",
    "players_number": "3+"
  },
  {
    "id": 10,
    "type": "Create_Ground_Spell",
    "label_fr": "Champions qui crééent des terrains",
    "label_en": "Champs with terrain création",
    "players_number": "3+"
  },
  {
    "id": 11,
    "type": "2_More_CC_Spell",
    "label_fr": "Champions possédant 2 CC ou +",
    "label_en": "Champs with 2+ immobilitzing spells",
    "players_number": "3+"
  }
];
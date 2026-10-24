// Full 15 Key Signature Groups Data (Standard 2 Octaves Range for Flute)
const scaleData = [
    {
        "group_id": 1,
        "sharps_count": 0,
        "flats_count": 0,
        "key_signature": "0 自然 (C/a)",
        "major_key": {
            "name": "C 大調",
            "german_name": "C-Dur",
            "alterations": "全自然音 (無升降)",
            "range": "C4 > C6 (Do > Do)",
            "arpeggio": "Do - Mi - Sol (C - E - G)"
        },
        "minor_key": {
            "name": "a 小調",
            "german_name": "a-moll",
            "alterations": "升 Sol (G#)",
            "range": "A3 > A5 (La > La)",
            "arpeggio": "La - Do - Mi (A - C - E)"
        }
    },
    {
        "group_id": 2,
        "sharps_count": 0,
        "flats_count": 1,
        "key_signature": "1♭ (F/d)",
        "major_key": {
            "name": "F 大調",
            "german_name": "F-Dur",
            "alterations": "降 Si (Bb)",
            "range": "F4 > F6 (Fa > Fa)",
            "arpeggio": "Fa - La - Do (F - A - C)"
        },
        "minor_key": {
            "name": "d 小調",
            "german_name": "d-moll",
            "alterations": "降 Si (Bb) + 升 Do (C#)",
            "range": "D4 > D6 (Re > Re)",
            "arpeggio": "Re - Fa - La (D - F - A)"
        }
    },
    {
        "group_id": 3,
        "sharps_count": 1,
        "flats_count": 0,
        "key_signature": "1♯ (G/e)",
        "major_key": {
            "name": "G 大調",
            "german_name": "G-Dur",
            "alterations": "升 Fa (F#)",
            "range": "G4 > G6 (Sol > Sol)",
            "arpeggio": "Sol - Si - Re (G - B - D)"
        },
        "minor_key": {
            "name": "e 小調",
            "german_name": "e-moll",
            "alterations": "升 Fa (F#) + 升 Re (D#)",
            "range": "E4 > E6 (Mi > Mi)",
            "arpeggio": "Mi - Sol - Si (E - G - B)"
        }
    },
    {
        "group_id": 4,
        "sharps_count": 0,
        "flats_count": 2,
        "key_signature": "2♭ (B/g)",
        "major_key": {
            "name": "降B 大調",
            "german_name": "B-Dur",
            "alterations": "降 Si (Bb)、降 Mi (Eb)",
            "range": "Bb3 > Bb5 (降 Si > 降 Si)",
            "arpeggio": "降 Si - Re - Fa (Bb - D - F)"
        },
        "minor_key": {
            "name": "g 小調",
            "german_name": "g-moll",
            "alterations": "降 Si、降 Mi + 升 Fa (F#)",
            "range": "G4 > G6 (Sol > Sol)",
            "arpeggio": "Sol - 降 Si - Re (G - Bb - D)"
        }
    },
    {
        "group_id": 5,
        "sharps_count": 2,
        "flats_count": 0,
        "key_signature": "2♯ (D/h)",
        "major_key": {
            "name": "D 大調",
            "german_name": "D-Dur",
            "alterations": "升 Fa (F#)、升 Do (C#)",
            "range": "D4 > D6 (Re > Re)",
            "arpeggio": "Re - 升 Fa - La (D - F# - A)"
        },
        "minor_key": {
            "name": "b 小調 (h 小調)",
            "german_name": "h-moll",
            "alterations": "升 Fa、升 Do + 升 La (A#)",
            "range": "B3 > B5 (Si > Si)",
            "arpeggio": "Si - Re - 升 Fa (B - D - F#)"
        }
    },
    {
        "group_id": 6,
        "sharps_count": 0,
        "flats_count": 3,
        "key_signature": "3♭ (Es/c)",
        "major_key": {
            "name": "降E 大調",
            "german_name": "Es-Dur",
            "alterations": "降 Si、降 Mi、降 La (Ab)",
            "range": "Eb4 > Eb6 (降 Mi > 降 Mi)",
            "arpeggio": "降 Mi - Sol - 降 Si (Eb - G - Bb)"
        },
        "minor_key": {
            "name": "c 小調",
            "german_name": "c-moll",
            "alterations": "降 Si、降 Mi、降 La + 還原 Si (B♮)",
            "range": "C4 > C6 (Do > Do)",
            "arpeggio": "Do - 降 Mi - Sol (C - Eb - G)"
        }
    },
    {
        "group_id": 7,
        "sharps_count": 3,
        "flats_count": 0,
        "key_signature": "3♯ (A/fis)",
        "major_key": {
            "name": "A 大調",
            "german_name": "A-Dur",
            "alterations": "升 Fa、升 Do、升 Sol (G#)",
            "range": "A3 > A5 (La > La)",
            "arpeggio": "La - 升 Do - Mi (A - C# - E)"
        },
        "minor_key": {
            "name": "升f 小調",
            "german_name": "fis-moll",
            "alterations": "升 Fa、升 Do、升 Sol + 升 Mi (E#)",
            "range": "F#4 > F#6 (升 Fa > 升 Fa)",
            "arpeggio": "升 Fa - La - 升 Do (F# - A - C#)"
        }
    },
    {
        "group_id": 8,
        "sharps_count": 0,
        "flats_count": 4,
        "key_signature": "4♭ (As/f)",
        "major_key": {
            "name": "降A 大調",
            "german_name": "As-Dur",
            "alterations": "降 Si、降 Mi、降 La、降 Re (Db)",
            "range": "Ab4 > Ab6 (降 La > 降 La)",
            "arpeggio": "降 La - Do - 降 Mi (Ab - C - Eb)"
        },
        "minor_key": {
            "name": "f 小調",
            "german_name": "f-moll",
            "alterations": "降 Si、降 Mi、降 La、降 Re + 還原 Mi (E♮)",
            "range": "F4 > F6 (Fa > Fa)",
            "arpeggio": "Fa - 降 La - Do (F - Ab - C)"
        }
    },
    {
        "group_id": 9,
        "sharps_count": 4,
        "flats_count": 0,
        "key_signature": "4♯ (E/cis)",
        "major_key": {
            "name": "E 大調",
            "german_name": "E-Dur",
            "alterations": "升 Fa、升 Do、升 Sol、升 Re (D#)",
            "range": "E4 > E6 (Mi > Mi)",
            "arpeggio": "Mi - 升 Sol - Si (E - G# - B)"
        },
        "minor_key": {
            "name": "升c 小調",
            "german_name": "cis-moll",
            "alterations": "升 Fa、升 Do、升 Sol、升 Re + 升 Si (B#)",
            "range": "C#4 > C#6 (升 Do > 升 Do)",
            "arpeggio": "升 Do - Mi - 升 Sol (C# - E - G#)"
        }
    },
    {
        "group_id": 10,
        "sharps_count": 0,
        "flats_count": 5,
        "key_signature": "5♭ (Des/b)",
        "major_key": {
            "name": "降D 大調",
            "german_name": "Des-Dur",
            "alterations": "降 Si、降 Mi、降 La、降 Re、降 Sol (Gb)",
            "range": "Db4 > Db6 (降 Re > 降 Re)",
            "arpeggio": "降 Re - Fa - 降 La (Db - F - Ab)"
        },
        "minor_key": {
            "name": "降b 小調",
            "german_name": "b-moll",
            "alterations": "降 Si、降 Mi、降 La、降 Re、降 Sol + 還原 La (A♮)",
            "range": "Bb4 > Bb6 (降 Si > 降 Si)",
            "arpeggio": "降 Si - 降 Re - Fa (Bb - Db - F)"
        }
    },
    {
        "group_id": 11,
        "sharps_count": 5,
        "flats_count": 0,
        "key_signature": "5♯ (H/gis)",
        "major_key": {
            "name": "B 大調 (H 大調)",
            "german_name": "H-Dur",
            "alterations": "升 Fa、升 Do、升 Sol、升 Re、升 La (A#)",
            "range": "B4 > B6 (Si > Si)",
            "arpeggio": "Si - 升 Re - 升 Fa (B - D# - F#)"
        },
        "minor_key": {
            "name": "升g 小調",
            "german_name": "gis-moll",
            "alterations": "升 Fa、升 Do、升 Sol、升 Re、升 La + 重升 Fa (Fx)",
            "range": "G#4 > G#6 (升 Sol > 升 Sol)",
            "arpeggio": "升 Sol - Si - 升 Re (G# - B - D#)"
        }
    },
    {
        "group_id": 12,
        "sharps_count": 0,
        "flats_count": 6,
        "key_signature": "6♭ (Ges/es)",
        "major_key": {
            "name": "降G 大調",
            "german_name": "Ges-Dur",
            "alterations": "降 Si、降 Mi、降 La、降 Re、降 Sol、降 Do (Cb)",
            "range": "Gb4 > Gb6 (降 Sol > 降 Sol)",
            "arpeggio": "降 Sol - 降 Si - 降 Re (Gb - Bb - Db)"
        },
        "minor_key": {
            "name": "降e 小調",
            "german_name": "es-moll",
            "alterations": "降 Si、降 Mi、降 La、降 Re、降 Sol、降 Do + 還原 Re (D♮)",
            "range": "Eb4 > Eb6 (降 Mi > 降 Mi)",
            "arpeggio": "降 Mi - 降 Sol - 降 Si (Eb - Gb - Bb)"
        }
    },
    {
        "group_id": 13,
        "sharps_count": 6,
        "flats_count": 0,
        "key_signature": "6♯ (Fis/dis)",
        "major_key": {
            "name": "升F 大調",
            "german_name": "Fis-Dur",
            "alterations": "升 Fa、升 Do、升 Sol、升 Re、升 La、升 Mi (E#)",
            "range": "F#4 > F#6 (升 Fa > 升 Fa)",
            "arpeggio": "升 Fa - 升 La - 升 Do (F# - A# - C#)"
        },
        "minor_key": {
            "name": "升d 小調",
            "german_name": "dis-moll",
            "alterations": "升 Fa、升 Do、升 Sol、升 Re、升 La、升 Mi + 重升 Do (Cx)",
            "range": "D#4 > D#6 (升 Re > 升 Re)",
            "arpeggio": "升 Re - 升 Fa - 升 La (D# - F# - A#)"
        }
    },
    {
        "group_id": 14,
        "sharps_count": 0,
        "flats_count": 7,
        "key_signature": "7♭ (Ces/as)",
        "major_key": {
            "name": "降C 大調",
            "german_name": "Ces-Dur",
            "alterations": "降 Si、降 Mi、降 La、降 Re、降 Sol、降 Do、降 Fa (Fb)",
            "range": "Cb5 > Cb7 (降 Do > 降 Do)",
            "arpeggio": "降 Do - 降 Mi - 降 Sol (Cb - Eb - Gb)"
        },
        "minor_key": {
            "name": "降a 小調",
            "german_name": "as-moll",
            "alterations": "降 Si、降 Mi、降 La、降 Re、降 Sol、降 Do、降 Fa + 還原 Sol (G♮)",
            "range": "Ab4 > Ab6 (降 La > 降 La)",
            "arpeggio": "降 La - 降 Do - 降 Mi (Ab - Cb - Eb)"
        }
    },
    {
        "group_id": 15,
        "sharps_count": 7,
        "flats_count": 0,
        "key_signature": "7♯ (Cis/ais)",
        "major_key": {
            "name": "升C 大調",
            "german_name": "Cis-Dur",
            "alterations": "升 Fa、升 Do、升 Sol、升 Re、升 La、升 Mi、升 Si (B#)",
            "range": "C#4 > C#6 (升 Do > 升 Do)",
            "arpeggio": "升 Do - 升 Mi - 升 Sol (C# - E# - G#)"
        },
        "minor_key": {
            "name": "升a 小調",
            "german_name": "ais-moll",
            "alterations": "升 Fa、升 Do、升 Sol、升 Re、升 La、升 Mi、升 Si + 重升 Sol (Gx)",
            "range": "A#4 > A#6 (升 La > 升 La)",
            "arpeggio": "升 La - 升 Do - 升 Mi (A# - C# - E#)"
        }
    }
];
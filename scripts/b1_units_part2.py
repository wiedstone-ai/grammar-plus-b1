# -*- coding: utf-8 -*-
"""
Grammar Plus B1 - Units 13 to 21 Exercises
Authentic exercises aligned with Sarah Jane Lewis textbook, including listening tracks TR 19 to TR 31 and illustrations.
"""

U13_EXERCISES = [
    {
        "id": "u13_ex1",
        "unitId": 13,
        "page": 38,
        "title": "Latihan 1: Memilih Preposisi Waktu yang Tepat (at, in, on)",
        "instruction": "Pilihlah preposisi waktu (at, in, on) yang sesuai dengan aturan tata bahasa Inggris.",
        "type": "choice",
        "questions": [
            {
                "q": "1. My birthday is [BLANK] 14th February.",
                "options": ["on", "in", "at", "by"],
                "answer": "on",
                "hint": "Gunakan 'on' untuk tanggal spesifik dan hari.",
                "explanation": "Untuk tanggal kalender lengkap, selalu gunakan 'on': 'on 14th February'."
            },
            {
                "q": "2. We usually go skiing in the Alps [BLANK] winter.",
                "options": ["in", "at", "on", "from"],
                "answer": "in",
                "hint": "Gunakan 'in' untuk musim (seasons), bulan, dan tahun.",
                "explanation": "Nama musim (winter, summer, etc.) menggunakan preposisi 'in'."
            },
            {
                "q": "3. The train leaves promptly [BLANK] 6.30 a.m.",
                "options": ["at", "on", "in", "to"],
                "answer": "at",
                "hint": "Waktu jam persis pada jam dinding.",
                "explanation": "Untuk jam tertentu (clock times), gunakan 'at': 'at 6.30 a.m.'."
            },
            {
                "q": "4. What are you doing [BLANK] the weekend?",
                "options": ["at", "in", "for", "during"],
                "answer": "at",
                "hint": "Dalam British English: at the weekend.",
                "explanation": "British English menggunakan 'at the weekend' (atau 'on the weekend' dalam American English)."
            },
            {
                "q": "5. I like reading books quietly [BLANK] night.",
                "options": ["at", "in", "on", "with"],
                "answer": "at",
                "hint": "Ungkapan waktu malam tanpa kata 'the'.",
                "explanation": "Frasa baku waktu malam adalah 'at night' (berbeda dengan 'in the morning / in the evening')."
            }
        ]
    },
    {
        "id": "u13_ex2",
        "unitId": 13,
        "page": 39,
        "title": "Latihan 2: Menyimak Audio (TR 19) - Preposisi Waktu dalam Konteks Sejarah & Peristiwa",
        "instruction": "Dengarkan rekaman audio (TR 19) dan tentukan preposisi waktu yang diucapkan dalam kalimat.",
        "type": "choice",
        "audioTrack": "TR 19",
        "questions": [
            {
                "q": "1. 'The first man landed on the moon [BLANK] 21st July 1969.'",
                "options": ["on", "in", "at", "during"],
                "answer": "on",
                "hint": "Tanggal pendaratan Apollo 11.",
                "explanation": "Audio TR 19 menyebutkan: 'landed on the moon on 21st July 1969'."
            },
            {
                "q": "2. 'In Italy football matches are usually played [BLANK] Sundays.'",
                "options": ["on", "at", "in", "every"],
                "answer": "on",
                "hint": "Nama hari dalam bentuk jamak.",
                "explanation": "Hari berulang (Sundays) dipasangkan dengan preposisi 'on'."
            },
            {
                "q": "3. 'There will be a space rocket launch [BLANK] the morning.'",
                "options": ["in", "at", "on", "by"],
                "answer": "in",
                "hint": "Bagian waktu hari (the morning).",
                "explanation": "Frasa waktu: 'in the morning'."
            },
            {
                "q": "4. 'In Britain bank holidays are always held [BLANK] Mondays.'",
                "options": ["on", "in", "at", "over"],
                "answer": "on",
                "hint": "Nama hari.",
                "explanation": "Nama hari selalu menggunakan preposisi 'on'."
            }
        ]
    },
    {
        "id": "u13_ex3",
        "unitId": 13,
        "page": 40,
        "title": "Latihan 3: Menyimak Audio (TR 20) - Preposisi Waktu dalam Kehidupan Sehari-hari",
        "instruction": "Dengarkan rekaman audio (TR 20) dan ketik preposisi waktu (before, after, during, at, on) yang sesuai.",
        "type": "fill",
        "audioTrack": "TR 20",
        "questions": [
            {"q": "1. Easter is always [BLANK] a Sunday.", "answer": "on", "hint": "Hari Minggu.", "explanation": "Hari selalu menggunakan preposisi 'on'."},
            {"q": "2. Friday comes [BLANK] Saturday.", "answer": "before", "hint": "Sebelum hari Sabtu.", "explanation": "Audio: 'Friday comes before Saturday.'"},
            {"q": "3. Friday comes [BLANK] Thursday.", "answer": "after", "hint": "Setelah hari Kamis.", "explanation": "Audio: 'Friday comes after Thursday.'"},
            {"q": "4. The bank is never open [BLANK] weekends, only [BLANK2] weekdays.", "answer": "at / on", "alternateAnswers": ["at/on", "at, on"], "hint": "at weekends / on weekdays", "explanation": "Audio: 'at weekends, only on weekdays.'"},
            {"q": "5. [BLANK] your holiday did you visit the museum?", "answer": "During", "alternateAnswers": ["during"], "hint": "Sepanjang durasi liburan.", "explanation": "Audio: 'During your holiday did you visit the museum?'"}
        ]
    }
]

U14_EXERCISES = [
    {
        "id": "u14_ex1",
        "unitId": 14,
        "page": 41,
        "title": "Latihan 1: Preposisi Pergerakan Berdasarkan Diagram Gambar",
        "instruction": "Perhatikan ilustrasi arah pergerakan (images/u14_movement.png) dan pilihlah preposisi pergerakan yang tepat.",
        "type": "choice",
        "image": "images/u14_movement.png",
        "questions": [
            {
                "q": "1. Gerakan masuk ke dalam ruangan tertutup atau wadah adalah:",
                "options": ["into", "onto", "out of", "through"],
                "answer": "into",
                "hint": "Masuk ke dalam.",
                "explanation": "'Into' menunjukkan pergerakan dari luar ke dalam (movement from outside to inside)."
            },
            {
                "q": "2. Gerakan keluar dari dalam suatu ruangan atau bangunan adalah:",
                "options": ["out of", "into", "towards", "away from"],
                "answer": "out of",
                "hint": "Keluar dari.",
                "explanation": "'Out of' adalah kebalikan dari 'into', menunjukkan pergerakan keluar."
            },
            {
                "q": "3. Gerakan melintasi terowongan atau hutan dari satu ujung ke ujung lain adalah:",
                "options": ["through", "across", "along", "over"],
                "answer": "through",
                "hint": "Menembus ruang 3D (terowongan/hutan).",
                "explanation": "'Through' digunakan saat bergerak menembus ruang tertutup atau bervolume seperti terowongan, pipa, atau hutan."
            },
            {
                "q": "4. Gerakan menyeberang dari satu sisi jalan atau sungai ke sisi seberang adalah:",
                "options": ["across", "along", "towards", "past"],
                "answer": "across",
                "hint": "Menyeberangi permukaan datar dari sisi ke sisi.",
                "explanation": "'Across' berarti menyeberang dari satu sisi ke sisi lain pada permukaan seperti jalan atau sungai."
            },
            {
                "q": "5. Gerakan berjalan menyusuri pinggir jalan atau tepi sungai mengikuti jalurnya adalah:",
                "options": ["along", "across", "through", "into"],
                "answer": "along",
                "hint": "Menyusuri garis jalan lurus sejajar.",
                "explanation": "'Along' berarti bergerak menyusuri atau sejajar dengan garis jalan atau sungai."
            }
        ]
    },
    {
        "id": "u14_ex2",
        "unitId": 14,
        "page": 42,
        "title": "Latihan 2: Menyimak Audio (TR 21) - Preposisi Pergerakan dalam Kalimat",
        "instruction": "Dengarkan rekaman audio (TR 21) dan pilihlah preposisi pergerakan yang diucapkan pembicara.",
        "type": "choice",
        "audioTrack": "TR 21",
        "questions": [
            {
                "q": "1. 'The cruise ship is very big and can't pass [BLANK] the harbour bridge.'",
                "options": ["under", "over", "through", "across"],
                "answer": "under",
                "hint": "Di bawah kolong jembatan.",
                "explanation": "Kapal pesiar harus lewat di bawah jembatan: 'pass under the harbour bridge'."
            },
            {
                "q": "2. 'Look! That girl is running [BLANK] the restaurant after her hat.'",
                "options": ["towards", "away from", "through", "into"],
                "answer": "towards",
                "hint": "Menuju ke arah restoran.",
                "explanation": "Audio: 'running towards the restaurant'."
            },
            {
                "q": "3. 'We're walking [BLANK] the cinema.'",
                "options": ["to", "into", "towards", "at"],
                "answer": "to",
                "hint": "Tujuan pergerakan.",
                "explanation": "Audio: 'walking to the cinema'."
            },
            {
                "q": "4. 'I'm afraid the ball flew [BLANK] the fence into the neighbour's garden.'",
                "options": ["over", "under", "through", "past"],
                "answer": "over",
                "hint": "Melompati / melayang di atas pagar.",
                "explanation": "Bola melayang melompati pagar: 'flew over the fence'."
            }
        ]
    },
    {
        "id": "u14_ex3",
        "unitId": 14,
        "page": 43,
        "title": "Latihan 3: Menyimak Audio (TR 22) - Arah dan Gerakan Sehari-hari",
        "instruction": "Dengarkan rekaman audio (TR 22) dan ketik kata preposisi pergerakan yang hilang.",
        "type": "fill",
        "audioTrack": "TR 22",
        "questions": [
            {"q": "1. Samantha is tired so she's going [BLANK] the stairs to bed.", "answer": "up", "hint": "Menaiki tangga ke atas.", "explanation": "Audio: 'going up the stairs to bed.'"},
            {"q": "2. When I'm not in a hurry, I walk [BLANK] Richmond Street and catch the bus there.", "answer": "along", "hint": "Menyusuri jalan.", "explanation": "Audio: 'walk along Richmond Street'."},
            {"q": "3. When my son comes [BLANK] of school, he always buys an ice cream.", "answer": "out", "hint": "Keluar dari sekolah.", "explanation": "Audio: 'comes out of school'."},
            {"q": "4. The thief ran [BLANK] the corner and vanished into the crowd.", "answer": "round", "alternateAnswers": ["around"], "hint": "Membelok di tikungan sudut.", "explanation": "Audio: 'ran round the corner'."}
        ]
    }
]

U15_EXERCISES = [
    {
        "id": "u15_ex1",
        "unitId": 15,
        "page": 44,
        "title": "Latihan 1: Menyimak Audio (TR 23) - Kalimat Perintah Afirmatif dan Negatif (Imperative)",
        "instruction": "Dengarkan rekaman audio (TR 23) lalu ketik kalimat perintah lengkap yang diucapkan pembicara.",
        "type": "fill",
        "audioTrack": "TR 23",
        "questions": [
            {"q": "1. [BLANK] on your coat!", "answer": "Put", "hint": "Kenakan mantelmu!", "explanation": "Audio: 'Put on your coat!'"},
            {"q": "2. [BLANK] talk so loudly!", "answer": "Don't", "alternateAnswers": ["Do not"], "hint": "Jangan bicara terlalu keras!", "explanation": "Bentuk perintah negatif diawali dengan 'Don't': 'Don't talk so loudly!'"},
            {"q": "3. [BLANK] take off your shoes!", "answer": "Don't", "alternateAnswers": ["Do not"], "hint": "Jangan lepas sepatumu!", "explanation": "Audio: 'Don't take off your shoes!'"},
            {"q": "4. [BLANK] at people!", "answer": "Don't point", "alternateAnswers": ["Do not point"], "hint": "Jangan menunjuk orang!", "explanation": "Audio: 'Don't point at people!'"},
            {"q": "5. [BLANK] gum in class!", "answer": "Don't chew", "alternateAnswers": ["Do not chew"], "hint": "Jangan mengunyah permen karet!", "explanation": "Audio: 'Don't chew gum in class!'"},
            {"q": "6. [BLANK] up this mess!", "answer": "Clean", "hint": "Bersihkan kekacauan ini!", "explanation": "Audio: 'Clean up this mess!'"}
        ]
    },
    {
        "id": "u15_ex2",
        "unitId": 15,
        "page": 45,
        "title": "Latihan 2: Menyimak Audio (TR 24) & Membaca Catatan Ibu (Mum's Note)",
        "instruction": "Perhatikan gambar memo catatan ibu (images/u15_ex2_note.png) dan dengarkan rekaman audio (TR 24) lalu jawablah pertanyaan pemahaman.",
        "type": "choice",
        "audioTrack": "TR 24",
        "image": "images/u15_ex2_note.png",
        "questions": [
            {
                "q": "1. What is the very first instruction Mum gives to Paul in her note?",
                "options": [
                    "Don't forget to feed the turtles.",
                    "Eat fruit and vegetables every day.",
                    "Lock the front door and close windows.",
                    "Do your maths homework."
                ],
                "answer": "Don't forget to feed the turtles.",
                "hint": "Hewan peliharaan kura-kura.",
                "explanation": "Memo Ibu tertulis: 'Don't forget to feed the turtles'."
            },
            {
                "q": "2. What must Paul remember to do whenever he goes out?",
                "options": [
                    "Lock the door and close the windows.",
                    "Turn off the refrigerator.",
                    "Leave the keys under the mat.",
                    "Call the neighbours."
                ],
                "answer": "Lock the door and close the windows.",
                "hint": "Keamanan rumah saat bepergian.",
                "explanation": "Ibu berpesan: 'lock the door and close the windows when you go out'."
            },
            {
                "q": "3. What advice does Mum give regarding healthy eating?",
                "options": [
                    "Eat fruit and vegetables every day.",
                    "Don't cook any hot meals.",
                    "Buy fast food from the corner shop.",
                    "Only drink cold water."
                ],
                "answer": "Eat fruit and vegetables every day.",
                "hint": "Makan buah dan sayur.",
                "explanation": "Memo menyatakan: 'Eat fruit and vegetables every day'."
            }
        ]
    },
    {
        "id": "u15_ex3",
        "unitId": 15,
        "page": 46,
        "title": "Latihan 3: Menyimak Audio (TR 25) & Membaca Tanda Larangan (Signs and Rules)",
        "instruction": "Perhatikan gambar rambu peringatan (images/u15_signs.png) dan dengarkan rekaman audio (TR 25) tentang anjuran menggunakan 'Let'.",
        "type": "choice",
        "audioTrack": "TR 25",
        "image": "images/u15_signs.png",
        "questions": [
            {
                "q": "1. Pada rambu 'NO SMOKING', kalimat imperatif yang setara adalah:",
                "options": [
                    "Do not smoke in this area.",
                    "You can smoke here if you want.",
                    "Please smoke outside only.",
                    "Smoking is allowed."
                ],
                "answer": "Do not smoke in this area.",
                "hint": "Bentuk larangan imperatif.",
                "explanation": "'No smoking' setara dengan kalimat perintah larangan: 'Do not smoke'."
            },
            {
                "q": "2. Audio TR 25 kalimat 1: 'Let her [BLANK] your jumper.'",
                "options": ["borrow", "to borrow", "borrowing", "borrows"],
                "answer": "borrow",
                "hint": "Setelah kata kerja 'let + object', gunakan bare infinitive (kata kerja dasar tanpa to).",
                "explanation": "Aturan tata bahasa untuk 'let': Let + Object pronoun + Bare Infinitive (tanpa 'to')."
            },
            {
                "q": "3. Audio TR 25 kalimat 4: 'Let Kate [BLANK] swimming.'",
                "options": ["go", "to go", "going", "goes"],
                "answer": "go",
                "hint": "Kata kerja bentuk dasar setelah let.",
                "explanation": "Gunakan kata kerja dasar 'go': 'Let Kate go swimming'."
            }
        ]
    }
]

U16_EXERCISES = [
    {
        "id": "u16_ex1",
        "unitId": 16,
        "page": 47,
        "title": "Latihan 1: Mengidentifikasi Kata Benda Countable dan Uncountable",
        "instruction": "Tentukan apakah kata benda berikut tergolong dapat dihitung (Countable) atau tidak dapat dihitung (Uncountable).",
        "type": "choice",
        "questions": [
            {
                "q": "1. 'information' (informasi)",
                "options": ["Uncountable (tidak dapat dihitung)", "Countable (dapat dihitung)"],
                "answer": "Uncountable (tidak dapat dihitung)",
                "hint": "Tidak memiliki bentuk jamak 'informations'.",
                "explanation": "Dalam bahasa Inggris, 'information' adalah kata benda tak dapat dihitung (uncountable) dan selalu berbentuk tunggal."
            },
            {
                "q": "2. 'luggage' (barang bawaan / koper)",
                "options": ["Uncountable (tidak dapat dihitung)", "Countable (dapat dihitung)"],
                "answer": "Uncountable (tidak dapat dihitung)",
                "hint": "Kumpulan barang bawaan dianggap massa tunggal.",
                "explanation": "'Luggage' dan 'baggage' adalah kata benda tak dapat dihitung."
            },
            {
                "q": "3. 'furniture' (perabotan mebel)",
                "options": ["Uncountable (tidak dapat dihitung)", "Countable (dapat dihitung)"],
                "answer": "Uncountable (tidak dapat dihitung)",
                "hint": "Gunakan 'a piece of furniture' jika ingin menghitungnya.",
                "explanation": "'Furniture' adalah kata benda kolektif tak dapat dihitung (uncountable noun)."
            },
            {
                "q": "4. 'advice' (nasihat)",
                "options": ["Uncountable (tidak dapat dihitung)", "Countable (dapat dihitung)"],
                "answer": "Uncountable (tidak dapat dihitung)",
                "hint": "Tidak ada bentuk 'advices'.",
                "explanation": "'Advice' tidak dapat dihitung. Satu nasihat disebut 'a piece of advice'."
            },
            {
                "q": "5. 'apple' (apel)",
                "options": ["Countable (dapat dihitung)", "Uncountable (tidak dapat dihitung)"],
                "answer": "Countable (dapat dihitung)",
                "hint": "Bisa memiliki bentuk jamak: apples.",
                "explanation": "'Apple' adalah kata benda tunggal yang dapat dihitung (an apple, two apples)."
            }
        ]
    },
    {
        "id": "u16_ex2",
        "unitId": 16,
        "page": 48,
        "title": "Latihan 2: Satuan Ukuran dan Wadah Partitif (Partitives)",
        "instruction": "Ketik kata wadah atau takaran yang tepat (bottle, slice, loaf, cup, bar, piece) untuk kata benda tak dapat dihitung berikut.",
        "type": "fill",
        "questions": [
            {"q": "1. a [BLANK] of bread", "answer": "loaf", "hint": "Satu buku/bungkah roti utuh.", "explanation": "Ukuran utuh roti tawar disebut 'a loaf of bread'."},
            {"q": "2. a [BLANK] of chocolate", "answer": "bar", "hint": "Satu batang cokelat.", "explanation": "Cokelat batangan disebut 'a bar of chocolate'."},
            {"q": "3. a [BLANK] of tea", "answer": "cup", "hint": "Secangkir teh.", "explanation": "Minuman panas disajikan dalam 'a cup of tea'."},
            {"q": "4. a [BLANK] of cake", "answer": "slice", "alternateAnswers": ["piece"], "hint": "Sepotong irisan kue.", "explanation": "Sepotong kue disebut 'a slice of cake' atau 'a piece of cake'."},
            {"q": "5. a [BLANK] of mineral water", "answer": "bottle", "hint": "Sebotol air mineral.", "explanation": "Wadah air kemasan disebut 'a bottle of water'."}
        ]
    }
]

U17_EXERCISES = [
    {
        "id": "u17_ex1",
        "unitId": 17,
        "page": 50,
        "title": "Latihan 1: Menyimak Audio (TR 26) - some vs any",
        "instruction": "Dengarkan rekaman audio (TR 26) dan pilihlah apakah kalimat menggunakan 'some' atau 'any'.",
        "type": "choice",
        "audioTrack": "TR 26",
        "questions": [
            {
                "q": "1. 'You must tell us [BLANK] more about your adventures in Asia.'",
                "options": ["some", "any", "a few", "no"],
                "answer": "some",
                "hint": "Kalimat berita positif.",
                "explanation": "Audio TR 26 kalimat 1 menggunakan 'some': 'tell us some more'."
            },
            {
                "q": "2. 'He wants some more dessert. Do we have [BLANK] left?'",
                "options": ["any", "some", "none", "few"],
                "answer": "any",
                "hint": "Kalimat tanya menanyakan ketersediaan.",
                "explanation": "Pertanyaan umum ketersediaan menggunakan 'any': 'Do we have any left?'"
            },
            {
                "q": "3. 'She asked me for some ice, but I didn't have [BLANK] in the freezer.'",
                "options": ["any", "some", "none", "little"],
                "answer": "any",
                "hint": "Kalimat negatif (didn't have).",
                "explanation": "Setelah kalimat negatif (didn't have), kita menggunakan 'any'."
            },
            {
                "q": "4. 'Would you like [BLANK] more coffee?'",
                "options": ["some", "any", "no", "a few"],
                "answer": "some",
                "hint": "Tawaran sopan (polite offer).",
                "explanation": "Dalam tawaran atau permintaan sopan (offers and requests), kita menggunakan 'some'."
            }
        ]
    },
    {
        "id": "u17_ex2",
        "unitId": 17,
        "page": 51,
        "title": "Latihan 2: Membedakan a few, a little, few, little",
        "instruction": "Ketik 'a few', 'a little', 'few', atau 'little' pada kolom isian sesuai konteks makna kalimat.",
        "type": "fill",
        "questions": [
            {"q": "1. I have [BLANK] money left, just enough to buy a sandwich and coffee.", "answer": "a little", "hint": "Sedikit uang tetapi cukup (positif) untuk benda tak dapat dihitung.", "explanation": "'A little' digunakan untuk benda tak dapat dihitung dengan makna cukup/ada sedikit."},
            {"q": "2. There are [BLANK] eggs in the fridge, so we can make an omelette.", "answer": "a few", "hint": "Sedikit telur (dapat dihitung) tetapi cukup.", "explanation": "'A few' digunakan untuk benda jamak yang dapat dihitung dengan konotasi positif."},
            {"q": "3. He has very [BLANK] friends because he is very rude and selfish.", "answer": "few", "hint": "Hampir tidak punya teman sama sekali (makna negatif).", "explanation": "'Few' (tanpa 'a') bermakna negatif: sangat sedikit/hampir tidak ada sama sekali."},
            {"q": "4. Hurry up, we have [BLANK] time before the train departs!", "answer": "little", "hint": "Hampir tidak ada waktu tersisa.", "explanation": "'Little' digunakan untuk waktu (uncountable) dengan makna negatif (hampir tidak ada)."}
        ]
    },
    {
        "id": "u17_ex3",
        "unitId": 17,
        "page": 52,
        "title": "Latihan 3: Menyimak Audio (TR 27) - Percakapan Belanja Ayah dan Alex",
        "instruction": "Dengarkan rekaman percakapan telepon belanja (TR 27) lalu jawab pertanyaan pemahaman berikut.",
        "type": "choice",
        "audioTrack": "TR 27",
        "questions": [
            {
                "q": "1. Where is Dad calling from?",
                "options": [
                    "At the local greengrocer's shop.",
                    "At the supermarket checkout.",
                    "From his office at work.",
                    "From the petrol station."
                ],
                "answer": "At the local greengrocer's shop.",
                "hint": "Ayah sedang berada di toko sayur.",
                "explanation": "Ayah mengatakan: 'I'm at the local greengrocer's but I forgot to bring mum's shopping list.'"
            },
            {
                "q": "2. What did Alex find in the fridge regarding carrots?",
                "options": [
                    "There are only two small carrots left, so Dad needs to buy some.",
                    "There are plenty of carrots in the drawer.",
                    "Mum already bought a bag of carrots yesterday.",
                    "They don't need any carrots at all."
                ],
                "answer": "There are only two small carrots left, so Dad needs to buy some.",
                "hint": "Hanya tersisa dua wortel kecil.",
                "explanation": "Alex memeriksa dan mendapati hanya ada 2 wortel kecil sehingga Ayah perlu membeli lagi."
            },
            {
                "q": "3. How many apples does Alex ask Dad to buy?",
                "options": ["A bag of red apples", "Just one green apple", "None at all", "Six kilograms"],
                "answer": "A bag of red apples",
                "hint": "Alex meminta satu kantong apel merah.",
                "explanation": "Alex menyebutkan bahwa persediaan apel habis dan meminta sekantong apel merah."
            }
        ]
    }
]

U18_EXERCISES = [
    {
        "id": "u18_ex1",
        "unitId": 18,
        "page": 53,
        "title": "Latihan 1: Memilih much, many, atau a lot of",
        "instruction": "Pilihlah penentu kuantitas yang tepat sesuai dengan jenis kata benda dan struktur kalimat.",
        "type": "choice",
        "questions": [
            {
                "q": "1. How [BLANK] students are there in your English class?",
                "options": ["many", "much", "a lot", "too much"],
                "answer": "many",
                "hint": "'Students' adalah kata benda jamak yang dapat dihitung.",
                "explanation": "Untuk kata benda jamak yang dapat dihitung (countable plural), gunakan 'many': 'How many students'."
            },
            {
                "q": "2. We don't have [BLANK] petrol left in the tank. We need to find a gas station.",
                "options": ["much", "many", "few", "a few"],
                "answer": "much",
                "hint": "'Petrol' (bensin) adalah kata benda tak dapat dihitung dalam kalimat negatif.",
                "explanation": "Dalam kalimat negatif dengan kata benda tak dapat dihitung (uncountable), gunakan 'much'."
            },
            {
                "q": "3. There are [BLANK] trees in this ancient forest.",
                "options": ["a lot of", "much", "many a", "too"],
                "answer": "a lot of",
                "hint": "Kalimat positif afirmatif.",
                "explanation": "Dalam kalimat afirmatif positif informal, 'a lot of' adalah pilihan yang paling alami."
            },
            {
                "q": "4. How [BLANK] does this leather wallet cost?",
                "options": ["much", "many", "lot", "little"],
                "answer": "much",
                "hint": "Menanyakan harga.",
                "explanation": "Pertanyaan harga menggunakan 'How much does it cost?'."
            }
        ]
    },
    {
        "id": "u18_ex2",
        "unitId": 18,
        "page": 54,
        "title": "Latihan 2: Penggunaan too, enough, dan so ... that",
        "instruction": "Ketik kata derajat yang tepat (too, enough, so) untuk melengkapi kalimat berikut.",
        "type": "fill",
        "questions": [
            {"q": "1. This coffee is [BLANK] hot to drink right now.", "answer": "too", "hint": "Terlalu panas hingga tidak bisa diminum (too + adj + to infinitive).", "explanation": "Pola 'too + adjective + to-verb' menyatakan derajat berlebihan yang menghalangi aksi."},
            {"q": "2. She is not old [BLANK] to drive a car.", "answer": "enough", "hint": "Cukup umur (adjective + enough).", "explanation": "'Enough' diletakkan SETELAH kata sifat: 'old enough'."},
            {"q": "3. The movie was [BLANK] exciting that nobody wanted it to end.", "answer": "so", "hint": "Sangat seru sehingga... (so + adj + that).", "explanation": "Pola 'so + adjective + that + clause' menyatakan sebab-akibat derajat intensitas."},
            {"q": "4. We haven't got [BLANK] chairs for everyone to sit down.", "answer": "enough", "hint": "Cukup kursi (enough + noun).", "explanation": "'Enough' diletakkan SEBELUM kata benda: 'enough chairs'."}
        ]
    },
    {
        "id": "u18_ex3",
        "unitId": 18,
        "page": 55,
        "title": "Latihan 3: Menyimak Audio (TR 28) - Bahan Masakan Shepherd's Pie & How much / How many",
        "instruction": "Dengarkan rekaman audio (TR 28) percakapan Andrew dan Beth memasak Shepherd's Pie lalu jawab pertanyaan berikut.",
        "type": "choice",
        "audioTrack": "TR 28",
        "questions": [
            {
                "q": "1. What dish are Andrew and Beth planning to cook for their friends?",
                "options": [
                    "Shepherd's pie using Andrew's mother's recipe.",
                    "Spaghetti bolognese with tomato sauce.",
                    "Roast chicken with mashed potatoes.",
                    "Beef burger and chips."
                ],
                "answer": "Shepherd's pie using Andrew's mother's recipe.",
                "hint": "Resep pie daging tradisional ibu Andrew.",
                "explanation": "Andrew mengatakan: 'I have my mother's recipe for shepherd's pie.'"
            },
            {
                "q": "2. How much minced meat do they need for the recipe?",
                "options": [
                    "500 grams of minced beef or lamb.",
                    "Two kilograms of chicken breast.",
                    "One small packet of bacon.",
                    "Only vegetables, no meat."
                ],
                "answer": "500 grams of minced beef or lamb.",
                "hint": "Jumlah daging cincang.",
                "explanation": "Resep membutuhkan sekitar 500 gram daging cincang (minced meat)."
            },
            {
                "q": "3. How many potatoes does Beth say they already have at home?",
                "options": [
                    "There are plenty of potatoes in the sack.",
                    "None at all, they must buy five kilos.",
                    "Just two rotten potatoes.",
                    "Only sweet potatoes."
                ],
                "answer": "There are plenty of potatoes in the sack.",
                "hint": "Persediaan kentang di rumah.",
                "explanation": "Beth memeriksa dan mendapati mereka masih memiliki banyak kentang."
            }
        ]
    }
]

U19_EXERCISES = [
    {
        "id": "u19_ex1",
        "unitId": 19,
        "page": 56,
        "title": "Latihan 1: Membedakan another, other, dan others",
        "instruction": "Pilihlah bentuk kata penentu distributif yang tepat untuk melengkapi kalimat.",
        "type": "choice",
        "questions": [
            {
                "q": "1. This cup of coffee is delicious. Can I have [BLANK] one, please?",
                "options": ["another", "other", "others", "the others"],
                "answer": "another",
                "hint": "'An + other' untuk satu benda tambahan tunggal.",
                "explanation": "'Another' digunakan sebelum kata benda tunggal yang dapat dihitung (singular countable) untuk arti 'satu lagi / tambahan'."
            },
            {
                "q": "2. Some students like studying in the library, while [BLANK] prefer studying at home.",
                "options": ["others", "other", "another", "anothers"],
                "answer": "others",
                "hint": "Berdiri sendiri sebagai kata ganti orang jamak tanpa kata benda setelahnya.",
                "explanation": "'Others' berfungsi sebagai kata ganti jamak mandiri (pronoun) yang berarti 'orang-orang lain'."
            },
            {
                "q": "3. Where are the [BLANK] students? The class has already started.",
                "options": ["other", "another", "others", "else"],
                "answer": "other",
                "hint": "Diikuti langsung oleh kata benda jamak 'students'.",
                "explanation": "'Other' digunakan sebagai kata penentu (determiner) sebelum kata benda jamak: 'the other students'."
            },
            {
                "q": "4. Is there anybody [BLANK] who would like to volunteer for the school play?",
                "options": ["else", "another", "other", "others"],
                "answer": "else",
                "hint": "Digunakan setelah kata ganti tak tentu (anybody, somebody, somewhere).",
                "explanation": "Setelah kata ganti tak tentu berakhiran -body/-one/-thing/-where, gunakan kata 'else': 'anybody else'."
            }
        ]
    },
    {
        "id": "u19_ex2",
        "unitId": 19,
        "page": 57,
        "title": "Latihan 2: both, either, dan neither",
        "instruction": "Ketik 'both', 'either', atau 'neither' pada kolom isian berikut.",
        "type": "fill",
        "questions": [
            {"q": "1. [BLANK] John and his brother are talented musicians.", "answer": "Both", "alternateAnswers": ["both"], "hint": "Keduanya (both ... and ...)", "explanation": "Pasangan kata 'both ... and ...' digunakan untuk menghubungkan dua hal/orang."},
            {"q": "2. A: Would you like tea or coffee? B: [BLANK], thank you. I only drink plain water.", "answer": "Neither", "alternateAnswers": ["neither"], "hint": "Tidak keduanya (dua-duanya ditolak).", "explanation": "'Neither' berarti tidak yang ini dan tidak juga yang itu (penolakan kedua opsi)."},
            {"q": "3. You can take [BLANK] the morning bus or the afternoon train.", "answer": "either", "alternateAnswers": ["Either"], "hint": "Pilihan salah satu dari dua (either ... or ...)", "explanation": "Pasangan 'either ... or ...' menawarkan pilihan antara salah satu dari dua alternatif."},
            {"q": "4. [BLANK] of my parents could attend the graduation ceremony because they were ill.", "answer": "Neither", "alternateAnswers": ["neither"], "hint": "Kedua orang tua saya sama-sama tidak dapat hadir.", "explanation": "'Neither of my parents' bermakna kedua orang tua tidak hadir."}
        ]
    }
]

U20_EXERCISES = [
    {
        "id": "u20_ex1",
        "unitId": 20,
        "page": 59,
        "title": "Latihan 1: Menulis Bentuk Genitif Kepemilikan 's",
        "instruction": "Ketik bentuk genitif yang tepat ('s atau s') untuk menunjukkan kepemilikan.",
        "type": "fill",
        "questions": [
            {"q": "1. the car belonging to my father -> my [BLANK] car", "answer": "father's", "hint": "Ayah saya tunggal.", "explanation": "Nama benda/orang tunggal ditambah petik s ('s): father's car."},
            {"q": "2. the toys of the children -> the [BLANK] toys", "answer": "children's", "hint": "'Children' adalah kata jamak tidak beraturan yang tidak berakhiran -s.", "explanation": "Kata benda jamak tak beraturan yang tidak berakhiran -s tetap ditambahkan 's: children's toys."},
            {"q": "3. the room of the girls -> the [BLANK] room", "answer": "girls'", "hint": "Kata jamak berakhiran huruf -s.", "explanation": "Kata benda jamak yang sudah berakhiran -s hanya ditambahkan tanda petik di belakangnya: girls' room."},
            {"q": "4. the office of Mr Jones -> Mr [BLANK] office", "answer": "Jones's", "alternateAnswers": ["Jones'"], "hint": "Nama berakhiran s.", "explanation": "Nama orang berakhiran -s dapat ditulis Jones's atau Jones'."}
        ]
    },
    {
        "id": "u20_ex2",
        "unitId": 20,
        "page": 60,
        "title": "Latihan 2: Menyimak Audio (TR 29) - Frasa Kepemilikan Genitif 's",
        "instruction": "Dengarkan rekaman audio (TR 29) dan pilihlah frasa kepemilikan yang disebutkan pembicara.",
        "type": "choice",
        "audioTrack": "TR 29",
        "questions": [
            {
                "q": "1. 'Germany's flag is [BLANK].'",
                "options": ["black, red and gold", "blue, white and red", "green, white and red", "red and white"],
                "answer": "black, red and gold",
                "hint": "Warna bendera Jerman.",
                "explanation": "Audio: 'Germany's flag is black, red and gold.'"
            },
            {
                "q": "2. 'The local council's new rules are [BLANK].'",
                "options": ["unpopular", "very popular", "strict", "cancelled"],
                "answer": "unpopular",
                "hint": "Tidak disukai publik.",
                "explanation": "Audio: 'The local council's new rules are unpopular.'"
            },
            {
                "q": "3. 'My sister's room is on the [BLANK] floor.'",
                "options": ["second", "first", "third", "ground"],
                "answer": "second",
                "hint": "Lantai dua.",
                "explanation": "Audio: 'My sister's room is on the second floor.'"
            },
            {
                "q": "4. 'France's capital is [BLANK].'",
                "options": ["Paris", "Lyon", "Marseille", "Nice"],
                "answer": "Paris",
                "hint": "Ibu kota Prancis.",
                "explanation": "Audio: 'France's capital is Paris.'"
            }
        ]
    },
    {
        "id": "u20_ex3",
        "unitId": 20,
        "page": 60,
        "title": "Latihan 3: Menyimak Audio (TR 30) - Dialog Kepemilikan Barang di Pantai (Whose & 's)",
        "instruction": "Dengarkan percakapan di pantai antara Timothy dan Samantha (TR 30) lalu jawab pertanyaan berikut.",
        "type": "choice",
        "audioTrack": "TR 30",
        "questions": [
            {
                "q": "1. Whose bathing suit was Timothy holding?",
                "options": [
                    "It was not Samantha's, because Samantha has a black bikini.",
                    "It belonged to Samantha.",
                    "It was Timothy's sister's.",
                    "It was the lifeguard's."
                ],
                "answer": "It was not Samantha's, because Samantha has a black bikini.",
                "hint": "Samantha berkata: 'I have a black one.'",
                "explanation": "Samantha menjelaskan baju renang miliknya berwarna hitam, sehingga baju renang tersebut bukan miliknya."
            },
            {
                "q": "2. What question word is used to ask about ownership in the dialogue?",
                "options": ["Whose", "Who's", "Which", "Where"],
                "answer": "Whose",
                "hint": "Kata tanya kepemilikan.",
                "explanation": "Kata tanya untuk kepemilikan adalah 'Whose' ('Whose is this?')."
            }
        ]
    }
]

U21_EXERCISES = [
    {
        "id": "u21_ex1",
        "unitId": 21,
        "page": 61,
        "title": "Latihan 1: Memilih Kata Ganti Refleksi (Reflexive Pronouns)",
        "instruction": "Pilihlah bentuk kata ganti refleksi (myself, yourself, himself, herself, itself, ourselves, yourselves, themselves) yang tepat.",
        "type": "choice",
        "questions": [
            {
                "q": "1. Tony cut [BLANK] with the sharp kitchen knife while preparing dinner.",
                "options": ["himself", "him", "his", "oneself"],
                "answer": "himself",
                "hint": "Tony = he -> himself",
                "explanation": "Ketika subjek dan objek adalah orang yang sama (Tony), gunakan reflexive pronoun 'himself'."
            },
            {
                "q": "2. Be careful, kids! The stove is very hot, don't burn [BLANK]!",
                "options": ["yourselves", "yourself", "themselves", "us"],
                "answer": "yourselves",
                "hint": "Ditujukan kepada 'kids' (anak-anak jamak).",
                "explanation": "Kata ganti refleksi untuk 'you' bentuk jamak (anak-anak) adalah 'yourselves'."
            },
            {
                "q": "3. We really enjoyed [BLANK] at the music festival last night.",
                "options": ["ourselves", "us", "our", "themselves"],
                "answer": "ourselves",
                "hint": "We -> ourselves",
                "explanation": "Frasa menikmati waktu: 'enjoy ourselves'."
            },
            {
                "q": "4. The cat licked [BLANK] clean after drinking the milk.",
                "options": ["itself", "it", "himself", "herself"],
                "answer": "itself",
                "hint": "Hewan tunggal (it).",
                "explanation": "Kata ganti refleksi untuk seekor hewan/benda tunggal adalah 'itself'."
            },
            {
                "q": "5. I don't need any help, I can fix this computer [BLANK].",
                "options": ["myself", "me", "my", "mine"],
                "answer": "myself",
                "hint": "I -> myself",
                "explanation": "Kata ganti refleksi penekanan mandiri untuk 'I' adalah 'myself'."
            }
        ]
    },
    {
        "id": "u21_ex2",
        "unitId": 21,
        "page": 62,
        "title": "Latihan 2: Menyimak Audio (TR 31) - Aksi Sehari-hari dan Kata Ganti Refleksi",
        "instruction": "Dengarkan rekaman audio (TR 31) dan ketik kata yang tepat melengkapi kalimat aksi.",
        "type": "fill",
        "audioTrack": "TR 31",
        "questions": [
            {"q": "1. Tom has decided to grow a beard, so he's stopped [BLANK].", "answer": "shaving", "hint": "Berhenti bercukur.", "explanation": "Audio: 'he's stopped shaving.' Dalam bahasa Inggris aksi bercukur rutin tidak memerlukan 'himself'."},
            {"q": "2. He got out of the shower, took a towel and dried [BLANK].", "answer": "himself", "hint": "Mengeringkan dirinya sendiri.", "explanation": "Audio: 'took a towel and dried himself.'"},
            {"q": "3. I tried to read but I just couldn't [BLANK].", "answer": "concentrate", "hint": "Berkonsentrasi.", "explanation": "Audio: 'I just couldn't concentrate.' Kata 'concentrate' tidak diikuti oleh 'myself'."},
            {"q": "4. They love each [BLANK] very much.", "answer": "other", "hint": "Saling mencintai satu sama lain.", "explanation": "Kata ganti timbal balik (reciprocal pronoun) untuk dua orang adalah 'each other'."}
        ]
    },
    {
        "id": "u21_ex3",
        "unitId": 21,
        "page": 63,
        "title": "Latihan 3: Ungkapan get + Kata Sifat (get + Adjective)",
        "instruction": "Pilihlah arti atau kata sifat yang tepat dalam frasa yang menggunakan struktur 'get + adjective'.",
        "type": "choice",
        "questions": [
            {
                "q": "1. It's already 6.00 p.m. in winter and it's starting to [BLANK]. Let's turn on the lights.",
                "options": ["get dark", "get angry", "get dressed", "get tired"],
                "answer": "get dark",
                "hint": "Mulai gelap / malam tiba.",
                "explanation": "'Get dark' berarti mulai menjadi gelap seiring terbenamnya matahari."
            },
            {
                "q": "2. After working 10 hours non-stop at the office, I usually [BLANK].",
                "options": ["get tired", "get rich", "get lost", "get married"],
                "answer": "get tired",
                "hint": "Merasa lelah / capek.",
                "explanation": "'Get tired' berarti menjadi lelah."
            },
            {
                "q": "3. If you don't use GPS navigation in a foreign city, you might easily [BLANK].",
                "options": ["get lost", "get ready", "get cold", "get better"],
                "answer": "get lost",
                "hint": "Tersesat jalan.",
                "explanation": "'Get lost' adalah ungkapan umum untuk tersesat arah."
            }
        ]
    }
]

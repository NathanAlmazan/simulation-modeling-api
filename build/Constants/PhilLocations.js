"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Locations = [
    {
        city: "Bangued",
        province: "Abra"
    },
    {
        city: "Boliney",
        province: "Abra"
    },
    {
        city: "Bucay",
        province: "Abra"
    },
    {
        city: "Bucloc",
        province: "Abra"
    },
    {
        city: "Daguioman",
        province: "Abra"
    },
    {
        city: "Danglas",
        province: "Abra"
    },
    {
        city: "Dolores",
        province: "Abra"
    },
    {
        city: "La Paz",
        province: "Abra"
    },
    {
        city: "Lacub",
        province: "Abra"
    },
    {
        city: "Lagangilang",
        province: "Abra"
    },
    {
        city: "Lagayan",
        province: "Abra"
    },
    {
        city: "Langiden",
        province: "Abra"
    },
    {
        city: "Licuan-Baay",
        province: "Abra"
    },
    {
        city: "Luba",
        province: "Abra"
    },
    {
        city: "Malibcong",
        province: "Abra"
    },
    {
        city: "Manabo",
        province: "Abra"
    },
    {
        city: "Peñarrubia",
        province: "Abra"
    },
    {
        city: "Pidigan",
        province: "Abra"
    },
    {
        city: "Pilar",
        province: "Abra"
    },
    {
        city: "Sallapadan",
        province: "Abra"
    },
    {
        city: "San Isidro",
        province: "Abra"
    },
    {
        city: "San Juan",
        province: "Abra"
    },
    {
        city: "San Quintin",
        province: "Abra"
    },
    {
        city: "Tayum",
        province: "Abra"
    },
    {
        city: "Tineg",
        province: "Abra"
    },
    {
        city: "Tubo",
        province: "Abra"
    },
    {
        city: "Villaviciosa",
        province: "Abra"
    },
    {
        city: "Buenavista",
        province: "Agusan del Norte"
    },
    {
        city: "Butuan",
        province: "Agusan del Norte"
    },
    {
        city: "Cabadbaran",
        province: "Agusan del Norte"
    },
    {
        city: "Carmen",
        province: "Agusan del Norte"
    },
    {
        city: "Jabonga",
        province: "Agusan del Norte"
    },
    {
        city: "Kitcharao",
        province: "Agusan del Norte"
    },
    {
        city: "Las Nieves",
        province: "Agusan del Norte"
    },
    {
        city: "Magallanes",
        province: "Agusan del Norte"
    },
    {
        city: "Nasipit",
        province: "Agusan del Norte"
    },
    {
        city: "Remedios T. Romualdez",
        province: "Agusan del Norte"
    },
    {
        city: "Santiago",
        province: "Agusan del Norte"
    },
    {
        city: "Tubay",
        province: "Agusan del Norte"
    },
    {
        city: "Bayugan",
        province: "Agusan del Sur"
    },
    {
        city: "Bunawan",
        province: "Agusan del Sur"
    },
    {
        city: "Esperanza",
        province: "Agusan del Sur"
    },
    {
        city: "La Paz",
        province: "Agusan del Sur"
    },
    {
        city: "Loreto",
        province: "Agusan del Sur"
    },
    {
        city: "Prosperidad",
        province: "Agusan del Sur"
    },
    {
        city: "Rosario",
        province: "Agusan del Sur"
    },
    {
        city: "San Francisco",
        province: "Agusan del Sur"
    },
    {
        city: "San Luis",
        province: "Agusan del Sur"
    },
    {
        city: "Santa Josefa",
        province: "Agusan del Sur"
    },
    {
        city: "Sibagat",
        province: "Agusan del Sur"
    },
    {
        city: "Talacogon",
        province: "Agusan del Sur"
    },
    {
        city: "Trento",
        province: "Agusan del Sur"
    },
    {
        city: "Veruela",
        province: "Agusan del Sur"
    },
    {
        city: "Altavas",
        province: "Aklan"
    },
    {
        city: "Balete",
        province: "Aklan"
    },
    {
        city: "Banga",
        province: "Aklan"
    },
    {
        city: "Batan",
        province: "Aklan"
    },
    {
        city: "Buruanga",
        province: "Aklan"
    },
    {
        city: "Ibajay",
        province: "Aklan"
    },
    {
        city: "Kalibo",
        province: "Aklan"
    },
    {
        city: "Lezo",
        province: "Aklan"
    },
    {
        city: "Libacao",
        province: "Aklan"
    },
    {
        city: "Madalag",
        province: "Aklan"
    },
    {
        city: "Makato",
        province: "Aklan"
    },
    {
        city: "Malay",
        province: "Aklan"
    },
    {
        city: "Malinao",
        province: "Aklan"
    },
    {
        city: "Nabas",
        province: "Aklan"
    },
    {
        city: "New Washington",
        province: "Aklan"
    },
    {
        city: "Numancia",
        province: "Aklan"
    },
    {
        city: "Tangalan",
        province: "Aklan"
    },
    {
        city: "Bacacay",
        province: "Albay"
    },
    {
        city: "Camalig",
        province: "Albay"
    },
    {
        city: "Daraga",
        province: "Albay"
    },
    {
        city: "Guinobatan",
        province: "Albay"
    },
    {
        city: "Jovellar",
        province: "Albay"
    },
    {
        city: "Legazpi",
        province: "Albay"
    },
    {
        city: "Libon",
        province: "Albay"
    },
    {
        city: "Ligao",
        province: "Albay"
    },
    {
        city: "Malilipot",
        province: "Albay"
    },
    {
        city: "Malinao",
        province: "Albay"
    },
    {
        city: "Manito",
        province: "Albay"
    },
    {
        city: "Oas",
        province: "Albay"
    },
    {
        city: "Pio Duran",
        province: "Albay"
    },
    {
        city: "Polangui",
        province: "Albay"
    },
    {
        city: "Rapu-Rapu",
        province: "Albay"
    },
    {
        city: "Santo Domingo",
        province: "Albay"
    },
    {
        city: "Tabaco",
        province: "Albay"
    },
    {
        city: "Tiwi",
        province: "Albay"
    },
    {
        city: "Anini-y",
        province: "Antique"
    },
    {
        city: "Barbaza",
        province: "Antique"
    },
    {
        city: "Belison",
        province: "Antique"
    },
    {
        city: "Bugasong",
        province: "Antique"
    },
    {
        city: "Caluya",
        province: "Antique"
    },
    {
        city: "Culasi",
        province: "Antique"
    },
    {
        city: "Hamtic",
        province: "Antique"
    },
    {
        city: "Laua-an",
        province: "Antique"
    },
    {
        city: "Libertad",
        province: "Antique"
    },
    {
        city: "Pandan",
        province: "Antique"
    },
    {
        city: "Patnongon",
        province: "Antique"
    },
    {
        city: "San Jose de Buenavista",
        province: "Antique"
    },
    {
        city: "San Remigio",
        province: "Antique"
    },
    {
        city: "Sebaste",
        province: "Antique"
    },
    {
        city: "Sibalom",
        province: "Antique"
    },
    {
        city: "Tibiao",
        province: "Antique"
    },
    {
        city: "Tobias Fornier",
        province: "Antique"
    },
    {
        city: "Valderrama",
        province: "Antique"
    },
    {
        city: "Calanasan",
        province: "Apayao"
    },
    {
        city: "Conner",
        province: "Apayao"
    },
    {
        city: "Flora",
        province: "Apayao"
    },
    {
        city: "Kabugao",
        province: "Apayao"
    },
    {
        city: "Luna",
        province: "Apayao"
    },
    {
        city: "Pudtol",
        province: "Apayao"
    },
    {
        city: "Santa Marcela",
        province: "Apayao"
    },
    {
        city: "Baler",
        province: "Aurora"
    },
    {
        city: "Casiguran",
        province: "Aurora"
    },
    {
        city: "Dilasag",
        province: "Aurora"
    },
    {
        city: "Dinalungan",
        province: "Aurora"
    },
    {
        city: "Dingalan",
        province: "Aurora"
    },
    {
        city: "Dipaculao",
        province: "Aurora"
    },
    {
        city: "Maria Aurora",
        province: "Aurora"
    },
    {
        city: "San Luis",
        province: "Aurora"
    },
    {
        city: "Akbar",
        province: "Basilan"
    },
    {
        city: "Al-Barka",
        province: "Basilan"
    },
    {
        city: "Hadji Mohammad Ajul",
        province: "Basilan"
    },
    {
        city: "Hadji Muhtamad",
        province: "Basilan"
    },
    {
        city: "Isabela",
        province: "Basilan"
    },
    {
        city: "Lamitan",
        province: "Basilan"
    },
    {
        city: "Lantawan",
        province: "Basilan"
    },
    {
        city: "Maluso",
        province: "Basilan"
    },
    {
        city: "Sumisip",
        province: "Basilan"
    },
    {
        city: "Tabuan-Lasa",
        province: "Basilan"
    },
    {
        city: "Tipo-Tipo",
        province: "Basilan"
    },
    {
        city: "Tuburan",
        province: "Basilan"
    },
    {
        city: "Ungkaya Pukan",
        province: "Basilan"
    },
    {
        city: "Abucay",
        province: "Bataan"
    },
    {
        city: "Bagac",
        province: "Bataan"
    },
    {
        city: "Balanga",
        province: "Bataan"
    },
    {
        city: "Dinalupihan",
        province: "Bataan"
    },
    {
        city: "Hermosa",
        province: "Bataan"
    },
    {
        city: "Limay",
        province: "Bataan"
    },
    {
        city: "Mariveles",
        province: "Bataan"
    },
    {
        city: "Morong",
        province: "Bataan"
    },
    {
        city: "Orani",
        province: "Bataan"
    },
    {
        city: "Orion",
        province: "Bataan"
    },
    {
        city: "Pilar",
        province: "Bataan"
    },
    {
        city: "Samal",
        province: "Bataan"
    },
    {
        city: "Basco",
        province: "Batanes"
    },
    {
        city: "Itbayat",
        province: "Batanes"
    },
    {
        city: "Ivana",
        province: "Batanes"
    },
    {
        city: "Mahatao",
        province: "Batanes"
    },
    {
        city: "Sabtang",
        province: "Batanes"
    },
    {
        city: "Uyugan",
        province: "Batanes"
    },
    {
        city: "Agoncillo",
        province: "Batangas"
    },
    {
        city: "Alitagtag",
        province: "Batangas"
    },
    {
        city: "Balayan",
        province: "Batangas"
    },
    {
        city: "Balete",
        province: "Batangas"
    },
    {
        city: "Batangas City",
        province: "Batangas"
    },
    {
        city: "Bauan",
        province: "Batangas"
    },
    {
        city: "Calaca",
        province: "Batangas"
    },
    {
        city: "Calatagan",
        province: "Batangas"
    },
    {
        city: "Cuenca",
        province: "Batangas"
    },
    {
        city: "Ibaan",
        province: "Batangas"
    },
    {
        city: "Laurel",
        province: "Batangas"
    },
    {
        city: "Lemery",
        province: "Batangas"
    },
    {
        city: "Lian",
        province: "Batangas"
    },
    {
        city: "Lipa",
        province: "Batangas"
    },
    {
        city: "Lobo",
        province: "Batangas"
    },
    {
        city: "Mabini",
        province: "Batangas"
    },
    {
        city: "Malvar",
        province: "Batangas"
    },
    {
        city: "Mataasnakahoy",
        province: "Batangas"
    },
    {
        city: "Nasugbu",
        province: "Batangas"
    },
    {
        city: "Padre Garcia",
        province: "Batangas"
    },
    {
        city: "Rosario",
        province: "Batangas"
    },
    {
        city: "San Jose",
        province: "Batangas"
    },
    {
        city: "San Juan",
        province: "Batangas"
    },
    {
        city: "San Luis",
        province: "Batangas"
    },
    {
        city: "San Nicolas",
        province: "Batangas"
    },
    {
        city: "San Pascual",
        province: "Batangas"
    },
    {
        city: "Santa Teresita",
        province: "Batangas"
    },
    {
        city: "Santo Tomas",
        province: "Batangas"
    },
    {
        city: "Taal",
        province: "Batangas"
    },
    {
        city: "Talisay",
        province: "Batangas"
    },
    {
        city: "Tanauan",
        province: "Batangas"
    },
    {
        city: "Taysan",
        province: "Batangas"
    },
    {
        city: "Tingloy",
        province: "Batangas"
    },
    {
        city: "Tuy",
        province: "Batangas"
    },
    {
        city: "Atok",
        province: "Benguet"
    },
    {
        city: "Baguio",
        province: "Benguet"
    },
    {
        city: "Bakun",
        province: "Benguet"
    },
    {
        city: "Bokod",
        province: "Benguet"
    },
    {
        city: "Buguias",
        province: "Benguet"
    },
    {
        city: "Itogon",
        province: "Benguet"
    },
    {
        city: "Kabayan",
        province: "Benguet"
    },
    {
        city: "Kapangan",
        province: "Benguet"
    },
    {
        city: "Kibungan",
        province: "Benguet"
    },
    {
        city: "La Trinidad",
        province: "Benguet"
    },
    {
        city: "Mankayan",
        province: "Benguet"
    },
    {
        city: "Sablan",
        province: "Benguet"
    },
    {
        city: "Tuba",
        province: "Benguet"
    },
    {
        city: "Tublay",
        province: "Benguet"
    },
    {
        city: "Almeria",
        province: "Biliran"
    },
    {
        city: "Biliran",
        province: "Biliran"
    },
    {
        city: "Cabucgayan",
        province: "Biliran"
    },
    {
        city: "Caibiran",
        province: "Biliran"
    },
    {
        city: "Culaba",
        province: "Biliran"
    },
    {
        city: "Kawayan",
        province: "Biliran"
    },
    {
        city: "Maripipi",
        province: "Biliran"
    },
    {
        city: "Naval",
        province: "Biliran"
    },
    {
        city: "Alburquerque",
        province: "Bohol"
    },
    {
        city: "Alicia",
        province: "Bohol"
    },
    {
        city: "Anda",
        province: "Bohol"
    },
    {
        city: "Antequera",
        province: "Bohol"
    },
    {
        city: "Baclayon",
        province: "Bohol"
    },
    {
        city: "Balilihan",
        province: "Bohol"
    },
    {
        city: "Batuan",
        province: "Bohol"
    },
    {
        city: "Bien Unido",
        province: "Bohol"
    },
    {
        city: "Bilar",
        province: "Bohol"
    },
    {
        city: "Buenavista",
        province: "Bohol"
    },
    {
        city: "Calape",
        province: "Bohol"
    },
    {
        city: "Candijay",
        province: "Bohol"
    },
    {
        city: "Carmen",
        province: "Bohol"
    },
    {
        city: "Catigbian",
        province: "Bohol"
    },
    {
        city: "Clarin",
        province: "Bohol"
    },
    {
        city: "Corella",
        province: "Bohol"
    },
    {
        city: "Cortes",
        province: "Bohol"
    },
    {
        city: "Dagohoy",
        province: "Bohol"
    },
    {
        city: "Danao",
        province: "Bohol"
    },
    {
        city: "Dauis",
        province: "Bohol"
    },
    {
        city: "Dimiao",
        province: "Bohol"
    },
    {
        city: "Duero",
        province: "Bohol"
    },
    {
        city: "Garcia Hernandez",
        province: "Bohol"
    },
    {
        city: "Getafe",
        province: "Bohol"
    },
    {
        city: "Guindulman",
        province: "Bohol"
    },
    {
        city: "Inabanga",
        province: "Bohol"
    },
    {
        city: "Jagna",
        province: "Bohol"
    },
    {
        city: "Lila",
        province: "Bohol"
    },
    {
        city: "Loay",
        province: "Bohol"
    },
    {
        city: "Loboc",
        province: "Bohol"
    },
    {
        city: "Loon",
        province: "Bohol"
    },
    {
        city: "Mabini",
        province: "Bohol"
    },
    {
        city: "Maribojoc",
        province: "Bohol"
    },
    {
        city: "Panglao",
        province: "Bohol"
    },
    {
        city: "Pilar",
        province: "Bohol"
    },
    {
        city: "President Carlos P. Garcia",
        province: "Bohol"
    },
    {
        city: "Sagbayan",
        province: "Bohol"
    },
    {
        city: "San Isidro",
        province: "Bohol"
    },
    {
        city: "San Miguel",
        province: "Bohol"
    },
    {
        city: "Sevilla",
        province: "Bohol"
    },
    {
        city: "Sierra Bullones",
        province: "Bohol"
    },
    {
        city: "Sikatuna",
        province: "Bohol"
    },
    {
        city: "Tagbilaran",
        province: "Bohol"
    },
    {
        city: "Talibon",
        province: "Bohol"
    },
    {
        city: "Trinidad",
        province: "Bohol"
    },
    {
        city: "Tubigon",
        province: "Bohol"
    },
    {
        city: "Ubay",
        province: "Bohol"
    },
    {
        city: "Valencia",
        province: "Bohol"
    },
    {
        city: "Baungon",
        province: "Bukidnon"
    },
    {
        city: "Cabanglasan",
        province: "Bukidnon"
    },
    {
        city: "Damulog",
        province: "Bukidnon"
    },
    {
        city: "Dangcagan",
        province: "Bukidnon"
    },
    {
        city: "Don Carlos",
        province: "Bukidnon"
    },
    {
        city: "Impasugong",
        province: "Bukidnon"
    },
    {
        city: "Kadingilan",
        province: "Bukidnon"
    },
    {
        city: "Kalilangan",
        province: "Bukidnon"
    },
    {
        city: "Kibawe",
        province: "Bukidnon"
    },
    {
        city: "Kitaotao",
        province: "Bukidnon"
    },
    {
        city: "Lantapan",
        province: "Bukidnon"
    },
    {
        city: "Libona",
        province: "Bukidnon"
    },
    {
        city: "Malaybalay",
        province: "Bukidnon"
    },
    {
        city: "Malitbog",
        province: "Bukidnon"
    },
    {
        city: "Manolo Fortich",
        province: "Bukidnon"
    },
    {
        city: "Maramag",
        province: "Bukidnon"
    },
    {
        city: "Pangantucan",
        province: "Bukidnon"
    },
    {
        city: "Quezon",
        province: "Bukidnon"
    },
    {
        city: "San Fernando",
        province: "Bukidnon"
    },
    {
        city: "Sumilao",
        province: "Bukidnon"
    },
    {
        city: "Talakag",
        province: "Bukidnon"
    },
    {
        city: "Valencia",
        province: "Bukidnon"
    },
    {
        city: "Angat",
        province: "Bulacan"
    },
    {
        city: "Balagtas",
        province: "Bulacan"
    },
    {
        city: "Baliuag",
        province: "Bulacan"
    },
    {
        city: "Bocaue",
        province: "Bulacan"
    },
    {
        city: "Bulakan",
        province: "Bulacan"
    },
    {
        city: "Bustos",
        province: "Bulacan"
    },
    {
        city: "Calumpit",
        province: "Bulacan"
    },
    {
        city: "Doña Remedios Trinidad",
        province: "Bulacan"
    },
    {
        city: "Guiguinto",
        province: "Bulacan"
    },
    {
        city: "Hagonoy",
        province: "Bulacan"
    },
    {
        city: "Malolos",
        province: "Bulacan"
    },
    {
        city: "Marilao",
        province: "Bulacan"
    },
    {
        city: "Meycauayan",
        province: "Bulacan"
    },
    {
        city: "Norzagaray",
        province: "Bulacan"
    },
    {
        city: "Obando",
        province: "Bulacan"
    },
    {
        city: "Pandi",
        province: "Bulacan"
    },
    {
        city: "Paombong",
        province: "Bulacan"
    },
    {
        city: "Plaridel",
        province: "Bulacan"
    },
    {
        city: "Pulilan",
        province: "Bulacan"
    },
    {
        city: "San Ildefonso",
        province: "Bulacan"
    },
    {
        city: "San Jose del Monte",
        province: "Bulacan"
    },
    {
        city: "San Miguel",
        province: "Bulacan"
    },
    {
        city: "San Rafael",
        province: "Bulacan"
    },
    {
        city: "Santa Maria",
        province: "Bulacan"
    },
    {
        city: "Abulug",
        province: "Cagayan"
    },
    {
        city: "Alcala",
        province: "Cagayan"
    },
    {
        city: "Allacapan",
        province: "Cagayan"
    },
    {
        city: "Amulung",
        province: "Cagayan"
    },
    {
        city: "Aparri",
        province: "Cagayan"
    },
    {
        city: "Baggao",
        province: "Cagayan"
    },
    {
        city: "Ballesteros",
        province: "Cagayan"
    },
    {
        city: "Buguey",
        province: "Cagayan"
    },
    {
        city: "Calayan",
        province: "Cagayan"
    },
    {
        city: "Camalaniugan",
        province: "Cagayan"
    },
    {
        city: "Claveria",
        province: "Cagayan"
    },
    {
        city: "Enrile",
        province: "Cagayan"
    },
    {
        city: "Gattaran",
        province: "Cagayan"
    },
    {
        city: "Gonzaga",
        province: "Cagayan"
    },
    {
        city: "Iguig",
        province: "Cagayan"
    },
    {
        city: "Lal-lo",
        province: "Cagayan"
    },
    {
        city: "Lasam",
        province: "Cagayan"
    },
    {
        city: "Pamplona",
        province: "Cagayan"
    },
    {
        city: "Peñablanca",
        province: "Cagayan"
    },
    {
        city: "Piat",
        province: "Cagayan"
    },
    {
        city: "Rizal",
        province: "Cagayan"
    },
    {
        city: "Sanchez-Mira",
        province: "Cagayan"
    },
    {
        city: "Santa Ana",
        province: "Cagayan"
    },
    {
        city: "Santa Praxedes",
        province: "Cagayan"
    },
    {
        city: "Santa Teresita",
        province: "Cagayan"
    },
    {
        city: "Santo Niño",
        province: "Cagayan"
    },
    {
        city: "Solana",
        province: "Cagayan"
    },
    {
        city: "Tuao",
        province: "Cagayan"
    },
    {
        city: "Tuguegarao",
        province: "Cagayan"
    },
    {
        city: "Basud",
        province: "Camarines Norte"
    },
    {
        city: "Capalonga",
        province: "Camarines Norte"
    },
    {
        city: "Daet",
        province: "Camarines Norte"
    },
    {
        city: "Jose Panganiban",
        province: "Camarines Norte"
    },
    {
        city: "Labo",
        province: "Camarines Norte"
    },
    {
        city: "Mercedes",
        province: "Camarines Norte"
    },
    {
        city: "Paracale",
        province: "Camarines Norte"
    },
    {
        city: "San Lorenzo Ruiz",
        province: "Camarines Norte"
    },
    {
        city: "San Vicente",
        province: "Camarines Norte"
    },
    {
        city: "Santa Elena",
        province: "Camarines Norte"
    },
    {
        city: "Talisay",
        province: "Camarines Norte"
    },
    {
        city: "Vinzons",
        province: "Camarines Norte"
    },
    {
        city: "Baao",
        province: "Camarines Sur"
    },
    {
        city: "Balatan",
        province: "Camarines Sur"
    },
    {
        city: "Bato",
        province: "Camarines Sur"
    },
    {
        city: "Bombon",
        province: "Camarines Sur"
    },
    {
        city: "Buhi",
        province: "Camarines Sur"
    },
    {
        city: "Bula",
        province: "Camarines Sur"
    },
    {
        city: "Cabusao",
        province: "Camarines Sur"
    },
    {
        city: "Calabanga",
        province: "Camarines Sur"
    },
    {
        city: "Camaligan",
        province: "Camarines Sur"
    },
    {
        city: "Canaman",
        province: "Camarines Sur"
    },
    {
        city: "Caramoan",
        province: "Camarines Sur"
    },
    {
        city: "Del Gallego",
        province: "Camarines Sur"
    },
    {
        city: "Gainza",
        province: "Camarines Sur"
    },
    {
        city: "Garchitorena",
        province: "Camarines Sur"
    },
    {
        city: "Goa",
        province: "Camarines Sur"
    },
    {
        city: "Iriga",
        province: "Camarines Sur"
    },
    {
        city: "Lagonoy",
        province: "Camarines Sur"
    },
    {
        city: "Libmanan",
        province: "Camarines Sur"
    },
    {
        city: "Lupi",
        province: "Camarines Sur"
    },
    {
        city: "Magarao",
        province: "Camarines Sur"
    },
    {
        city: "Milaor",
        province: "Camarines Sur"
    },
    {
        city: "Minalabac",
        province: "Camarines Sur"
    },
    {
        city: "Nabua",
        province: "Camarines Sur"
    },
    {
        city: "Naga",
        province: "Camarines Sur"
    },
    {
        city: "Ocampo",
        province: "Camarines Sur"
    },
    {
        city: "Pamplona",
        province: "Camarines Sur"
    },
    {
        city: "Pasacao",
        province: "Camarines Sur"
    },
    {
        city: "Pili",
        province: "Camarines Sur"
    },
    {
        city: "Presentacion",
        province: "Camarines Sur"
    },
    {
        city: "Ragay",
        province: "Camarines Sur"
    },
    {
        city: "Sagñay",
        province: "Camarines Sur"
    },
    {
        city: "San Fernando",
        province: "Camarines Sur"
    },
    {
        city: "San Jose",
        province: "Camarines Sur"
    },
    {
        city: "Sipocot",
        province: "Camarines Sur"
    },
    {
        city: "Siruma",
        province: "Camarines Sur"
    },
    {
        city: "Tigaon",
        province: "Camarines Sur"
    },
    {
        city: "Tinambac",
        province: "Camarines Sur"
    },
    {
        city: "Catarman",
        province: "Camiguin"
    },
    {
        city: "Guinsiliban",
        province: "Camiguin"
    },
    {
        city: "Mahinog",
        province: "Camiguin"
    },
    {
        city: "Mambajao",
        province: "Camiguin"
    },
    {
        city: "Sagay",
        province: "Camiguin"
    },
    {
        city: "Cuartero",
        province: "Capiz"
    },
    {
        city: "Dao",
        province: "Capiz"
    },
    {
        city: "Dumalag",
        province: "Capiz"
    },
    {
        city: "Dumarao",
        province: "Capiz"
    },
    {
        city: "Ivisan",
        province: "Capiz"
    },
    {
        city: "Jamindan",
        province: "Capiz"
    },
    {
        city: "Ma-ayon",
        province: "Capiz"
    },
    {
        city: "Mambusao",
        province: "Capiz"
    },
    {
        city: "Panay",
        province: "Capiz"
    },
    {
        city: "Panitan",
        province: "Capiz"
    },
    {
        city: "Pilar",
        province: "Capiz"
    },
    {
        city: "Pontevedra",
        province: "Capiz"
    },
    {
        city: "President Roxas",
        province: "Capiz"
    },
    {
        city: "Roxas",
        province: "Capiz"
    },
    {
        city: "Sapian",
        province: "Capiz"
    },
    {
        city: "Sigma",
        province: "Capiz"
    },
    {
        city: "Tapaz",
        province: "Capiz"
    },
    {
        city: "Bagamanoc",
        province: "Catanduanes"
    },
    {
        city: "Baras",
        province: "Catanduanes"
    },
    {
        city: "Bato",
        province: "Catanduanes"
    },
    {
        city: "Caramoran",
        province: "Catanduanes"
    },
    {
        city: "Gigmoto",
        province: "Catanduanes"
    },
    {
        city: "Pandan",
        province: "Catanduanes"
    },
    {
        city: "Panganiban",
        province: "Catanduanes"
    },
    {
        city: "San Andres",
        province: "Catanduanes"
    },
    {
        city: "San Miguel",
        province: "Catanduanes"
    },
    {
        city: "Viga",
        province: "Catanduanes"
    },
    {
        city: "Virac",
        province: "Catanduanes"
    },
    {
        city: "Alfonso",
        province: "Cavite"
    },
    {
        city: "Amadeo",
        province: "Cavite"
    },
    {
        city: "Bacoor",
        province: "Cavite"
    },
    {
        city: "Carmona",
        province: "Cavite"
    },
    {
        city: "Cavite City",
        province: "Cavite"
    },
    {
        city: "Dasmariñas",
        province: "Cavite"
    },
    {
        city: "General Emilio Aguinaldo",
        province: "Cavite"
    },
    {
        city: "General Mariano Alvarez",
        province: "Cavite"
    },
    {
        city: "General Trias",
        province: "Cavite"
    },
    {
        city: "Imus",
        province: "Cavite"
    },
    {
        city: "Indang",
        province: "Cavite"
    },
    {
        city: "Kawit",
        province: "Cavite"
    },
    {
        city: "Magallanes",
        province: "Cavite"
    },
    {
        city: "Maragondon",
        province: "Cavite"
    },
    {
        city: "Mendez",
        province: "Cavite"
    },
    {
        city: "Naic",
        province: "Cavite"
    },
    {
        city: "Noveleta",
        province: "Cavite"
    },
    {
        city: "Rosario",
        province: "Cavite"
    },
    {
        city: "Silang",
        province: "Cavite"
    },
    {
        city: "Tagaytay",
        province: "Cavite"
    },
    {
        city: "Tanza",
        province: "Cavite"
    },
    {
        city: "Ternate",
        province: "Cavite"
    },
    {
        city: "Trece Martires",
        province: "Cavite"
    },
    {
        city: "Alcantara",
        province: "Cebu"
    },
    {
        city: "Alcoy",
        province: "Cebu"
    },
    {
        city: "Alegria",
        province: "Cebu"
    },
    {
        city: "Aloguinsan",
        province: "Cebu"
    },
    {
        city: "Argao",
        province: "Cebu"
    },
    {
        city: "Asturias",
        province: "Cebu"
    },
    {
        city: "Badian",
        province: "Cebu"
    },
    {
        city: "Balamban",
        province: "Cebu"
    },
    {
        city: "Bantayan",
        province: "Cebu"
    },
    {
        city: "Barili",
        province: "Cebu"
    },
    {
        city: "Bogo",
        province: "Cebu"
    },
    {
        city: "Boljoon",
        province: "Cebu"
    },
    {
        city: "Borbon",
        province: "Cebu"
    },
    {
        city: "Carcar",
        province: "Cebu"
    },
    {
        city: "Carmen",
        province: "Cebu"
    },
    {
        city: "Catmon",
        province: "Cebu"
    },
    {
        city: "Cebu City",
        province: "Cebu"
    },
    {
        city: "Compostela",
        province: "Cebu"
    },
    {
        city: "Consolacion",
        province: "Cebu"
    },
    {
        city: "Cordova",
        province: "Cebu"
    },
    {
        city: "Daanbantayan",
        province: "Cebu"
    },
    {
        city: "Dalaguete",
        province: "Cebu"
    },
    {
        city: "Danao",
        province: "Cebu"
    },
    {
        city: "Dumanjug",
        province: "Cebu"
    },
    {
        city: "Ginatilan",
        province: "Cebu"
    },
    {
        city: "Lapu-Lapu",
        province: "Cebu"
    },
    {
        city: "Liloan",
        province: "Cebu"
    },
    {
        city: "Madridejos",
        province: "Cebu"
    },
    {
        city: "Malabuyoc",
        province: "Cebu"
    },
    {
        city: "Mandaue",
        province: "Cebu"
    },
    {
        city: "Medellin",
        province: "Cebu"
    },
    {
        city: "Minglanilla",
        province: "Cebu"
    },
    {
        city: "Moalboal",
        province: "Cebu"
    },
    {
        city: "Naga",
        province: "Cebu"
    },
    {
        city: "Oslob",
        province: "Cebu"
    },
    {
        city: "Pilar",
        province: "Cebu"
    },
    {
        city: "Pinamungajan",
        province: "Cebu"
    },
    {
        city: "Poro",
        province: "Cebu"
    },
    {
        city: "Ronda",
        province: "Cebu"
    },
    {
        city: "Samboan",
        province: "Cebu"
    },
    {
        city: "San Fernando",
        province: "Cebu"
    },
    {
        city: "San Francisco",
        province: "Cebu"
    },
    {
        city: "San Remigio",
        province: "Cebu"
    },
    {
        city: "Santa Fe",
        province: "Cebu"
    },
    {
        city: "Santander",
        province: "Cebu"
    },
    {
        city: "Sibonga",
        province: "Cebu"
    },
    {
        city: "Sogod",
        province: "Cebu"
    },
    {
        city: "Tabogon",
        province: "Cebu"
    },
    {
        city: "Tabuelan",
        province: "Cebu"
    },
    {
        city: "Talisay",
        province: "Cebu"
    },
    {
        city: "Toledo",
        province: "Cebu"
    },
    {
        city: "Tuburan",
        province: "Cebu"
    },
    {
        city: "Tudela",
        province: "Cebu"
    },
    {
        city: "Alamada",
        province: "Cotabato"
    },
    {
        city: "Aleosan",
        province: "Cotabato"
    },
    {
        city: "Antipas",
        province: "Cotabato"
    },
    {
        city: "Arakan",
        province: "Cotabato"
    },
    {
        city: "Banisilan",
        province: "Cotabato"
    },
    {
        city: "Carmen",
        province: "Cotabato"
    },
    {
        city: "Kabacan",
        province: "Cotabato"
    },
    {
        city: "Kidapawan",
        province: "Cotabato"
    },
    {
        city: "Libungan",
        province: "Cotabato"
    },
    {
        city: "M'lang",
        province: "Cotabato"
    },
    {
        city: "Magpet",
        province: "Cotabato"
    },
    {
        city: "Makilala",
        province: "Cotabato"
    },
    {
        city: "Matalam",
        province: "Cotabato"
    },
    {
        city: "Midsayap",
        province: "Cotabato"
    },
    {
        city: "Pigcawayan",
        province: "Cotabato"
    },
    {
        city: "Pikit",
        province: "Cotabato"
    },
    {
        city: "President Roxas",
        province: "Cotabato"
    },
    {
        city: "Tulunan",
        province: "Cotabato"
    },
    {
        city: "Compostela",
        province: "Davao de Oro"
    },
    {
        city: "Laak",
        province: "Davao de Oro"
    },
    {
        city: "Mabini",
        province: "Davao de Oro"
    },
    {
        city: "Maco",
        province: "Davao de Oro"
    },
    {
        city: "Maragusan",
        province: "Davao de Oro"
    },
    {
        city: "Mawab",
        province: "Davao de Oro"
    },
    {
        city: "Monkayo",
        province: "Davao de Oro"
    },
    {
        city: "Montevista",
        province: "Davao de Oro"
    },
    {
        city: "Nabunturan",
        province: "Davao de Oro"
    },
    {
        city: "New Bataan",
        province: "Davao de Oro"
    },
    {
        city: "Pantukan",
        province: "Davao de Oro"
    },
    {
        city: "Asuncion",
        province: "Davao del Norte"
    },
    {
        city: "Braulio E. Dujali",
        province: "Davao del Norte"
    },
    {
        city: "Carmen",
        province: "Davao del Norte"
    },
    {
        city: "Kapalong",
        province: "Davao del Norte"
    },
    {
        city: "New Corella",
        province: "Davao del Norte"
    },
    {
        city: "Panabo",
        province: "Davao del Norte"
    },
    {
        city: "Samal",
        province: "Davao del Norte"
    },
    {
        city: "San Isidro",
        province: "Davao del Norte"
    },
    {
        city: "Santo Tomas",
        province: "Davao del Norte"
    },
    {
        city: "Tagum",
        province: "Davao del Norte"
    },
    {
        city: "Talaingod",
        province: "Davao del Norte"
    },
    {
        city: "Bansalan",
        province: "Davao del Sur"
    },
    {
        city: "Davao City",
        province: "Davao del Sur"
    },
    {
        city: "Digos",
        province: "Davao del Sur"
    },
    {
        city: "Hagonoy",
        province: "Davao del Sur"
    },
    {
        city: "Kiblawan",
        province: "Davao del Sur"
    },
    {
        city: "Magsaysay",
        province: "Davao del Sur"
    },
    {
        city: "Malalag",
        province: "Davao del Sur"
    },
    {
        city: "Matanao",
        province: "Davao del Sur"
    },
    {
        city: "Padada",
        province: "Davao del Sur"
    },
    {
        city: "Santa Cruz",
        province: "Davao del Sur"
    },
    {
        city: "Sulop",
        province: "Davao del Sur"
    },
    {
        city: "Don Marcelino",
        province: "Davao Occidental"
    },
    {
        city: "Jose Abad Santos",
        province: "Davao Occidental"
    },
    {
        city: "Malita",
        province: "Davao Occidental"
    },
    {
        city: "Santa Maria",
        province: "Davao Occidental"
    },
    {
        city: "Sarangani",
        province: "Davao Occidental"
    },
    {
        city: "Baganga",
        province: "Davao Oriental"
    },
    {
        city: "Banaybanay",
        province: "Davao Oriental"
    },
    {
        city: "Boston",
        province: "Davao Oriental"
    },
    {
        city: "Caraga",
        province: "Davao Oriental"
    },
    {
        city: "Cateel",
        province: "Davao Oriental"
    },
    {
        city: "Governor Generoso",
        province: "Davao Oriental"
    },
    {
        city: "Lupon",
        province: "Davao Oriental"
    },
    {
        city: "Manay",
        province: "Davao Oriental"
    },
    {
        city: "Mati",
        province: "Davao Oriental"
    },
    {
        city: "San Isidro",
        province: "Davao Oriental"
    },
    {
        city: "Tarragona",
        province: "Davao Oriental"
    },
    {
        city: "Basilisa",
        province: "Dinagat Islands"
    },
    {
        city: "Cagdianao",
        province: "Dinagat Islands"
    },
    {
        city: "Dinagat",
        province: "Dinagat Islands"
    },
    {
        city: "Libjo",
        province: "Dinagat Islands"
    },
    {
        city: "Loreto",
        province: "Dinagat Islands"
    },
    {
        city: "San Jose",
        province: "Dinagat Islands"
    },
    {
        city: "Tubajon",
        province: "Dinagat Islands"
    },
    {
        city: "Arteche",
        province: "Eastern Samar"
    },
    {
        city: "Balangiga",
        province: "Eastern Samar"
    },
    {
        city: "Balangkayan",
        province: "Eastern Samar"
    },
    {
        city: "Borongan",
        province: "Eastern Samar"
    },
    {
        city: "Can-avid",
        province: "Eastern Samar"
    },
    {
        city: "Dolores",
        province: "Eastern Samar"
    },
    {
        city: "General MacArthur",
        province: "Eastern Samar"
    },
    {
        city: "Giporlos",
        province: "Eastern Samar"
    },
    {
        city: "Guiuan",
        province: "Eastern Samar"
    },
    {
        city: "Hernani",
        province: "Eastern Samar"
    },
    {
        city: "Jipapad",
        province: "Eastern Samar"
    },
    {
        city: "Lawaan",
        province: "Eastern Samar"
    },
    {
        city: "Llorente",
        province: "Eastern Samar"
    },
    {
        city: "Maslog",
        province: "Eastern Samar"
    },
    {
        city: "Maydolong",
        province: "Eastern Samar"
    },
    {
        city: "Mercedes",
        province: "Eastern Samar"
    },
    {
        city: "Oras",
        province: "Eastern Samar"
    },
    {
        city: "Quinapondan",
        province: "Eastern Samar"
    },
    {
        city: "Salcedo",
        province: "Eastern Samar"
    },
    {
        city: "San Julian",
        province: "Eastern Samar"
    },
    {
        city: "San Policarpo",
        province: "Eastern Samar"
    },
    {
        city: "Sulat",
        province: "Eastern Samar"
    },
    {
        city: "Taft",
        province: "Eastern Samar"
    },
    {
        city: "Buenavista",
        province: "Guimaras"
    },
    {
        city: "Jordan",
        province: "Guimaras"
    },
    {
        city: "Nueva Valencia",
        province: "Guimaras"
    },
    {
        city: "San Lorenzo",
        province: "Guimaras"
    },
    {
        city: "Sibunag",
        province: "Guimaras"
    },
    {
        city: "Aguinaldo",
        province: "Ifugao"
    },
    {
        city: "Alfonso Lista",
        province: "Ifugao"
    },
    {
        city: "Asipulo",
        province: "Ifugao"
    },
    {
        city: "Banaue",
        province: "Ifugao"
    },
    {
        city: "Hingyon",
        province: "Ifugao"
    },
    {
        city: "Hungduan",
        province: "Ifugao"
    },
    {
        city: "Kiangan",
        province: "Ifugao"
    },
    {
        city: "Lagawe",
        province: "Ifugao"
    },
    {
        city: "Lamut",
        province: "Ifugao"
    },
    {
        city: "Mayoyao",
        province: "Ifugao"
    },
    {
        city: "Tinoc",
        province: "Ifugao"
    },
    {
        city: "Adams",
        province: "Ilocos Norte"
    },
    {
        city: "Bacarra",
        province: "Ilocos Norte"
    },
    {
        city: "Badoc",
        province: "Ilocos Norte"
    },
    {
        city: "Bangui",
        province: "Ilocos Norte"
    },
    {
        city: "Banna",
        province: "Ilocos Norte"
    },
    {
        city: "Batac",
        province: "Ilocos Norte"
    },
    {
        city: "Burgos",
        province: "Ilocos Norte"
    },
    {
        city: "Carasi",
        province: "Ilocos Norte"
    },
    {
        city: "Currimao",
        province: "Ilocos Norte"
    },
    {
        city: "Dingras",
        province: "Ilocos Norte"
    },
    {
        city: "Dumalneg",
        province: "Ilocos Norte"
    },
    {
        city: "Laoag",
        province: "Ilocos Norte"
    },
    {
        city: "Marcos",
        province: "Ilocos Norte"
    },
    {
        city: "Nueva Era",
        province: "Ilocos Norte"
    },
    {
        city: "Pagudpud",
        province: "Ilocos Norte"
    },
    {
        city: "Paoay",
        province: "Ilocos Norte"
    },
    {
        city: "Pasuquin",
        province: "Ilocos Norte"
    },
    {
        city: "Piddig",
        province: "Ilocos Norte"
    },
    {
        city: "Pinili",
        province: "Ilocos Norte"
    },
    {
        city: "San Nicolas",
        province: "Ilocos Norte"
    },
    {
        city: "Sarrat",
        province: "Ilocos Norte"
    },
    {
        city: "Solsona",
        province: "Ilocos Norte"
    },
    {
        city: "Vintar",
        province: "Ilocos Norte"
    },
    {
        city: "Alilem",
        province: "Ilocos Sur"
    },
    {
        city: "Banayoyo",
        province: "Ilocos Sur"
    },
    {
        city: "Bantay",
        province: "Ilocos Sur"
    },
    {
        city: "Burgos",
        province: "Ilocos Sur"
    },
    {
        city: "Cabugao",
        province: "Ilocos Sur"
    },
    {
        city: "Candon",
        province: "Ilocos Sur"
    },
    {
        city: "Caoayan",
        province: "Ilocos Sur"
    },
    {
        city: "Cervantes",
        province: "Ilocos Sur"
    },
    {
        city: "Galimuyod",
        province: "Ilocos Sur"
    },
    {
        city: "Gregorio del Pilar",
        province: "Ilocos Sur"
    },
    {
        city: "Lidlidda",
        province: "Ilocos Sur"
    },
    {
        city: "Magsingal",
        province: "Ilocos Sur"
    },
    {
        city: "Nagbukel",
        province: "Ilocos Sur"
    },
    {
        city: "Narvacan",
        province: "Ilocos Sur"
    },
    {
        city: "Quirino",
        province: "Ilocos Sur"
    },
    {
        city: "Salcedo",
        province: "Ilocos Sur"
    },
    {
        city: "San Emilio",
        province: "Ilocos Sur"
    },
    {
        city: "San Esteban",
        province: "Ilocos Sur"
    },
    {
        city: "San Ildefonso",
        province: "Ilocos Sur"
    },
    {
        city: "San Juan",
        province: "Ilocos Sur"
    },
    {
        city: "San Vicente",
        province: "Ilocos Sur"
    },
    {
        city: "Santa",
        province: "Ilocos Sur"
    },
    {
        city: "Santa Catalina",
        province: "Ilocos Sur"
    },
    {
        city: "Santa Cruz",
        province: "Ilocos Sur"
    },
    {
        city: "Santa Lucia",
        province: "Ilocos Sur"
    },
    {
        city: "Santa Maria",
        province: "Ilocos Sur"
    },
    {
        city: "Santiago",
        province: "Ilocos Sur"
    },
    {
        city: "Santo Domingo",
        province: "Ilocos Sur"
    },
    {
        city: "Sigay",
        province: "Ilocos Sur"
    },
    {
        city: "Sinait",
        province: "Ilocos Sur"
    },
    {
        city: "Sugpon",
        province: "Ilocos Sur"
    },
    {
        city: "Suyo",
        province: "Ilocos Sur"
    },
    {
        city: "Tagudin",
        province: "Ilocos Sur"
    },
    {
        city: "Vigan",
        province: "Ilocos Sur"
    },
    {
        city: "Ajuy",
        province: "Iloilo"
    },
    {
        city: "Alimodian",
        province: "Iloilo"
    },
    {
        city: "Anilao",
        province: "Iloilo"
    },
    {
        city: "Badiangan",
        province: "Iloilo"
    },
    {
        city: "Balasan",
        province: "Iloilo"
    },
    {
        city: "Banate",
        province: "Iloilo"
    },
    {
        city: "Barotac Nuevo",
        province: "Iloilo"
    },
    {
        city: "Barotac Viejo",
        province: "Iloilo"
    },
    {
        city: "Batad",
        province: "Iloilo"
    },
    {
        city: "Bingawan",
        province: "Iloilo"
    },
    {
        city: "Cabatuan",
        province: "Iloilo"
    },
    {
        city: "Calinog",
        province: "Iloilo"
    },
    {
        city: "Carles",
        province: "Iloilo"
    },
    {
        city: "Concepcion",
        province: "Iloilo"
    },
    {
        city: "Dingle",
        province: "Iloilo"
    },
    {
        city: "Dueñas",
        province: "Iloilo"
    },
    {
        city: "Dumangas",
        province: "Iloilo"
    },
    {
        city: "Estancia",
        province: "Iloilo"
    },
    {
        city: "Guimbal",
        province: "Iloilo"
    },
    {
        city: "Igbaras",
        province: "Iloilo"
    },
    {
        city: "Iloilo City",
        province: "Iloilo"
    },
    {
        city: "Janiuay",
        province: "Iloilo"
    },
    {
        city: "Lambunao",
        province: "Iloilo"
    },
    {
        city: "Leganes",
        province: "Iloilo"
    },
    {
        city: "Lemery",
        province: "Iloilo"
    },
    {
        city: "Leon",
        province: "Iloilo"
    },
    {
        city: "Maasin",
        province: "Iloilo"
    },
    {
        city: "Miagao",
        province: "Iloilo"
    },
    {
        city: "Mina",
        province: "Iloilo"
    },
    {
        city: "New Lucena",
        province: "Iloilo"
    },
    {
        city: "Oton",
        province: "Iloilo"
    },
    {
        city: "Passi",
        province: "Iloilo"
    },
    {
        city: "Pavia",
        province: "Iloilo"
    },
    {
        city: "Pototan",
        province: "Iloilo"
    },
    {
        city: "San Dionisio",
        province: "Iloilo"
    },
    {
        city: "San Enrique",
        province: "Iloilo"
    },
    {
        city: "San Joaquin",
        province: "Iloilo"
    },
    {
        city: "San Miguel",
        province: "Iloilo"
    },
    {
        city: "San Rafael",
        province: "Iloilo"
    },
    {
        city: "Santa Barbara",
        province: "Iloilo"
    },
    {
        city: "Sara",
        province: "Iloilo"
    },
    {
        city: "Tigbauan",
        province: "Iloilo"
    },
    {
        city: "Tubungan",
        province: "Iloilo"
    },
    {
        city: "Zarraga",
        province: "Iloilo"
    },
    {
        city: "Alicia",
        province: "Isabela"
    },
    {
        city: "Angadanan",
        province: "Isabela"
    },
    {
        city: "Aurora",
        province: "Isabela"
    },
    {
        city: "Benito Soliven",
        province: "Isabela"
    },
    {
        city: "Burgos",
        province: "Isabela"
    },
    {
        city: "Cabagan",
        province: "Isabela"
    },
    {
        city: "Cabatuan",
        province: "Isabela"
    },
    {
        city: "Cauayan",
        province: "Isabela"
    },
    {
        city: "Cordon",
        province: "Isabela"
    },
    {
        city: "Delfin Albano",
        province: "Isabela"
    },
    {
        city: "Dinapigue",
        province: "Isabela"
    },
    {
        city: "Divilacan",
        province: "Isabela"
    },
    {
        city: "Echague",
        province: "Isabela"
    },
    {
        city: "Gamu",
        province: "Isabela"
    },
    {
        city: "Ilagan",
        province: "Isabela"
    },
    {
        city: "Jones",
        province: "Isabela"
    },
    {
        city: "Luna",
        province: "Isabela"
    },
    {
        city: "Maconacon",
        province: "Isabela"
    },
    {
        city: "Mallig",
        province: "Isabela"
    },
    {
        city: "Naguilian",
        province: "Isabela"
    },
    {
        city: "Palanan",
        province: "Isabela"
    },
    {
        city: "Quezon",
        province: "Isabela"
    },
    {
        city: "Quirino",
        province: "Isabela"
    },
    {
        city: "Ramon",
        province: "Isabela"
    },
    {
        city: "Reina Mercedes",
        province: "Isabela"
    },
    {
        city: "Roxas",
        province: "Isabela"
    },
    {
        city: "San Agustin",
        province: "Isabela"
    },
    {
        city: "San Guillermo",
        province: "Isabela"
    },
    {
        city: "San Isidro",
        province: "Isabela"
    },
    {
        city: "San Manuel",
        province: "Isabela"
    },
    {
        city: "San Mariano",
        province: "Isabela"
    },
    {
        city: "San Mateo",
        province: "Isabela"
    },
    {
        city: "San Pablo",
        province: "Isabela"
    },
    {
        city: "Santa Maria",
        province: "Isabela"
    },
    {
        city: "Santiago",
        province: "Isabela"
    },
    {
        city: "Santo Tomas",
        province: "Isabela"
    },
    {
        city: "Tumauini",
        province: "Isabela"
    },
    {
        city: "Balbalan",
        province: "Kalinga"
    },
    {
        city: "Lubuagan",
        province: "Kalinga"
    },
    {
        city: "Pasil",
        province: "Kalinga"
    },
    {
        city: "Pinukpuk",
        province: "Kalinga"
    },
    {
        city: "Rizal",
        province: "Kalinga"
    },
    {
        city: "Tabuk",
        province: "Kalinga"
    },
    {
        city: "Tanudan",
        province: "Kalinga"
    },
    {
        city: "Tinglayan",
        province: "Kalinga"
    },
    {
        city: "Agoo",
        province: "La Union"
    },
    {
        city: "Aringay",
        province: "La Union"
    },
    {
        city: "Bacnotan",
        province: "La Union"
    },
    {
        city: "Bagulin",
        province: "La Union"
    },
    {
        city: "Balaoan",
        province: "La Union"
    },
    {
        city: "Bangar",
        province: "La Union"
    },
    {
        city: "Bauang",
        province: "La Union"
    },
    {
        city: "Burgos",
        province: "La Union"
    },
    {
        city: "Caba",
        province: "La Union"
    },
    {
        city: "Luna",
        province: "La Union"
    },
    {
        city: "Naguilian",
        province: "La Union"
    },
    {
        city: "Pugo",
        province: "La Union"
    },
    {
        city: "Rosario",
        province: "La Union"
    },
    {
        city: "San Fernando",
        province: "La Union"
    },
    {
        city: "San Gabriel",
        province: "La Union"
    },
    {
        city: "San Juan",
        province: "La Union"
    },
    {
        city: "Santo Tomas",
        province: "La Union"
    },
    {
        city: "Santol",
        province: "La Union"
    },
    {
        city: "Sudipen",
        province: "La Union"
    },
    {
        city: "Tubao",
        province: "La Union"
    },
    {
        city: "Alaminos",
        province: "Laguna"
    },
    {
        city: "Bay",
        province: "Laguna"
    },
    {
        city: "Biñan",
        province: "Laguna"
    },
    {
        city: "Cabuyao",
        province: "Laguna"
    },
    {
        city: "Calamba",
        province: "Laguna"
    },
    {
        city: "Calauan",
        province: "Laguna"
    },
    {
        city: "Cavinti",
        province: "Laguna"
    },
    {
        city: "Famy",
        province: "Laguna"
    },
    {
        city: "Kalayaan",
        province: "Laguna"
    },
    {
        city: "Liliw",
        province: "Laguna"
    },
    {
        city: "Los Baños",
        province: "Laguna"
    },
    {
        city: "Luisiana",
        province: "Laguna"
    },
    {
        city: "Lumban",
        province: "Laguna"
    },
    {
        city: "Mabitac",
        province: "Laguna"
    },
    {
        city: "Magdalena",
        province: "Laguna"
    },
    {
        city: "Majayjay",
        province: "Laguna"
    },
    {
        city: "Nagcarlan",
        province: "Laguna"
    },
    {
        city: "Paete",
        province: "Laguna"
    },
    {
        city: "Pagsanjan",
        province: "Laguna"
    },
    {
        city: "Pakil",
        province: "Laguna"
    },
    {
        city: "Pangil",
        province: "Laguna"
    },
    {
        city: "Pila",
        province: "Laguna"
    },
    {
        city: "Rizal",
        province: "Laguna"
    },
    {
        city: "San Pablo",
        province: "Laguna"
    },
    {
        city: "San Pedro",
        province: "Laguna"
    },
    {
        city: "Santa Cruz",
        province: "Laguna"
    },
    {
        city: "Santa Maria",
        province: "Laguna"
    },
    {
        city: "Santa Rosa",
        province: "Laguna"
    },
    {
        city: "Siniloan",
        province: "Laguna"
    },
    {
        city: "Victoria",
        province: "Laguna"
    },
    {
        city: "Bacolod",
        province: "Lanao del Norte"
    },
    {
        city: "Balo-i",
        province: "Lanao del Norte"
    },
    {
        city: "Baroy",
        province: "Lanao del Norte"
    },
    {
        city: "Iligan",
        province: "Lanao del Norte"
    },
    {
        city: "Kapatagan",
        province: "Lanao del Norte"
    },
    {
        city: "Kauswagan",
        province: "Lanao del Norte"
    },
    {
        city: "Kolambugan",
        province: "Lanao del Norte"
    },
    {
        city: "Lala",
        province: "Lanao del Norte"
    },
    {
        city: "Linamon",
        province: "Lanao del Norte"
    },
    {
        city: "Magsaysay",
        province: "Lanao del Norte"
    },
    {
        city: "Maigo",
        province: "Lanao del Norte"
    },
    {
        city: "Matungao",
        province: "Lanao del Norte"
    },
    {
        city: "Munai",
        province: "Lanao del Norte"
    },
    {
        city: "Nunungan",
        province: "Lanao del Norte"
    },
    {
        city: "Pantao Ragat",
        province: "Lanao del Norte"
    },
    {
        city: "Pantar",
        province: "Lanao del Norte"
    },
    {
        city: "Poona Piagapo",
        province: "Lanao del Norte"
    },
    {
        city: "Salvador",
        province: "Lanao del Norte"
    },
    {
        city: "Sapad",
        province: "Lanao del Norte"
    },
    {
        city: "Sultan Naga Dimaporo",
        province: "Lanao del Norte"
    },
    {
        city: "Tagoloan",
        province: "Lanao del Norte"
    },
    {
        city: "Tangcal",
        province: "Lanao del Norte"
    },
    {
        city: "Tubod",
        province: "Lanao del Norte"
    },
    {
        city: "Amai Manabilang",
        province: "Lanao del Sur"
    },
    {
        city: "Bacolod-Kalawi",
        province: "Lanao del Sur"
    },
    {
        city: "Balabagan",
        province: "Lanao del Sur"
    },
    {
        city: "Balindong",
        province: "Lanao del Sur"
    },
    {
        city: "Bayang",
        province: "Lanao del Sur"
    },
    {
        city: "Binidayan",
        province: "Lanao del Sur"
    },
    {
        city: "Buadiposo-Buntong",
        province: "Lanao del Sur"
    },
    {
        city: "Bubong",
        province: "Lanao del Sur"
    },
    {
        city: "Butig",
        province: "Lanao del Sur"
    },
    {
        city: "Calanogas",
        province: "Lanao del Sur"
    },
    {
        city: "Ditsaan-Ramain",
        province: "Lanao del Sur"
    },
    {
        city: "Ganassi",
        province: "Lanao del Sur"
    },
    {
        city: "Kapai",
        province: "Lanao del Sur"
    },
    {
        city: "Kapatagan",
        province: "Lanao del Sur"
    },
    {
        city: "Lumba-Bayabao",
        province: "Lanao del Sur"
    },
    {
        city: "Lumbaca-Unayan",
        province: "Lanao del Sur"
    },
    {
        city: "Lumbatan",
        province: "Lanao del Sur"
    },
    {
        city: "Lumbayanague",
        province: "Lanao del Sur"
    },
    {
        city: "Madalum",
        province: "Lanao del Sur"
    },
    {
        city: "Madamba",
        province: "Lanao del Sur"
    },
    {
        city: "Maguing",
        province: "Lanao del Sur"
    },
    {
        city: "Malabang",
        province: "Lanao del Sur"
    },
    {
        city: "Marantao",
        province: "Lanao del Sur"
    },
    {
        city: "Marawi",
        province: "Lanao del Sur"
    },
    {
        city: "Marogong",
        province: "Lanao del Sur"
    },
    {
        city: "Masiu",
        province: "Lanao del Sur"
    },
    {
        city: "Mulondo",
        province: "Lanao del Sur"
    },
    {
        city: "Pagayawan",
        province: "Lanao del Sur"
    },
    {
        city: "Piagapo",
        province: "Lanao del Sur"
    },
    {
        city: "Picong",
        province: "Lanao del Sur"
    },
    {
        city: "Poona Bayabao",
        province: "Lanao del Sur"
    },
    {
        city: "Pualas",
        province: "Lanao del Sur"
    },
    {
        city: "Saguiaran",
        province: "Lanao del Sur"
    },
    {
        city: "Sultan Dumalondong",
        province: "Lanao del Sur"
    },
    {
        city: "Tagoloan II",
        province: "Lanao del Sur"
    },
    {
        city: "Tamparan",
        province: "Lanao del Sur"
    },
    {
        city: "Taraka",
        province: "Lanao del Sur"
    },
    {
        city: "Tubaran",
        province: "Lanao del Sur"
    },
    {
        city: "Tugaya",
        province: "Lanao del Sur"
    },
    {
        city: "Wao",
        province: "Lanao del Sur"
    },
    {
        city: "Abuyog",
        province: "Leyte"
    },
    {
        city: "Alangalang",
        province: "Leyte"
    },
    {
        city: "Albuera",
        province: "Leyte"
    },
    {
        city: "Babatngon",
        province: "Leyte"
    },
    {
        city: "Barugo",
        province: "Leyte"
    },
    {
        city: "Bato",
        province: "Leyte"
    },
    {
        city: "Baybay",
        province: "Leyte"
    },
    {
        city: "Burauen",
        province: "Leyte"
    },
    {
        city: "Calubian",
        province: "Leyte"
    },
    {
        city: "Capoocan",
        province: "Leyte"
    },
    {
        city: "Carigara",
        province: "Leyte"
    },
    {
        city: "Dagami",
        province: "Leyte"
    },
    {
        city: "Dulag",
        province: "Leyte"
    },
    {
        city: "Hilongos",
        province: "Leyte"
    },
    {
        city: "Hindang",
        province: "Leyte"
    },
    {
        city: "Inopacan",
        province: "Leyte"
    },
    {
        city: "Isabel",
        province: "Leyte"
    },
    {
        city: "Jaro",
        province: "Leyte"
    },
    {
        city: "Javier",
        province: "Leyte"
    },
    {
        city: "Julita",
        province: "Leyte"
    },
    {
        city: "Kananga",
        province: "Leyte"
    },
    {
        city: "La Paz",
        province: "Leyte"
    },
    {
        city: "Leyte",
        province: "Leyte"
    },
    {
        city: "MacArthur",
        province: "Leyte"
    },
    {
        city: "Mahaplag",
        province: "Leyte"
    },
    {
        city: "Matag-ob",
        province: "Leyte"
    },
    {
        city: "Matalom",
        province: "Leyte"
    },
    {
        city: "Mayorga",
        province: "Leyte"
    },
    {
        city: "Merida",
        province: "Leyte"
    },
    {
        city: "Ormoc",
        province: "Leyte"
    },
    {
        city: "Palo",
        province: "Leyte"
    },
    {
        city: "Palompon",
        province: "Leyte"
    },
    {
        city: "Pastrana",
        province: "Leyte"
    },
    {
        city: "San Isidro",
        province: "Leyte"
    },
    {
        city: "San Miguel",
        province: "Leyte"
    },
    {
        city: "Santa Fe",
        province: "Leyte"
    },
    {
        city: "Tabango",
        province: "Leyte"
    },
    {
        city: "Tabontabon",
        province: "Leyte"
    },
    {
        city: "Tacloban",
        province: "Leyte"
    },
    {
        city: "Tanauan",
        province: "Leyte"
    },
    {
        city: "Tolosa",
        province: "Leyte"
    },
    {
        city: "Tunga",
        province: "Leyte"
    },
    {
        city: "Villaba",
        province: "Leyte"
    },
    {
        city: "Ampatuan",
        province: "Maguindanao"
    },
    {
        city: "Barira",
        province: "Maguindanao"
    },
    {
        city: "Buldon",
        province: "Maguindanao"
    },
    {
        city: "Buluan",
        province: "Maguindanao"
    },
    {
        city: "Cotabato City",
        province: "Maguindanao"
    },
    {
        city: "Datu Abdullah Sangki",
        province: "Maguindanao"
    },
    {
        city: "Datu Anggal Midtimbang",
        province: "Maguindanao"
    },
    {
        city: "Datu Blah T. Sinsuat",
        province: "Maguindanao"
    },
    {
        city: "Datu Hoffer Ampatuan",
        province: "Maguindanao"
    },
    {
        city: "Datu Montawal",
        province: "Maguindanao"
    },
    {
        city: "Datu Odin Sinsuat",
        province: "Maguindanao"
    },
    {
        city: "Datu Paglas",
        province: "Maguindanao"
    },
    {
        city: "Datu Piang",
        province: "Maguindanao"
    },
    {
        city: "Datu Salibo",
        province: "Maguindanao"
    },
    {
        city: "Datu Saudi-Ampatuan",
        province: "Maguindanao"
    },
    {
        city: "Datu Unsay",
        province: "Maguindanao"
    },
    {
        city: "General Salipada K. Pendatun",
        province: "Maguindanao"
    },
    {
        city: "Guindulungan",
        province: "Maguindanao"
    },
    {
        city: "Kabuntalan",
        province: "Maguindanao"
    },
    {
        city: "Mamasapano",
        province: "Maguindanao"
    },
    {
        city: "Mangudadatu",
        province: "Maguindanao"
    },
    {
        city: "Matanog",
        province: "Maguindanao"
    },
    {
        city: "Northern Kabuntalan",
        province: "Maguindanao"
    },
    {
        city: "Pagalungan",
        province: "Maguindanao"
    },
    {
        city: "Paglat",
        province: "Maguindanao"
    },
    {
        city: "Pandag",
        province: "Maguindanao"
    },
    {
        city: "Parang",
        province: "Maguindanao"
    },
    {
        city: "Rajah Buayan",
        province: "Maguindanao"
    },
    {
        city: "Shariff Aguak",
        province: "Maguindanao"
    },
    {
        city: "Shariff Saydona Mustapha",
        province: "Maguindanao"
    },
    {
        city: "South Upi",
        province: "Maguindanao"
    },
    {
        city: "Sultan Kudarat",
        province: "Maguindanao"
    },
    {
        city: "Sultan Mastura",
        province: "Maguindanao"
    },
    {
        city: "Sultan sa Barongis",
        province: "Maguindanao"
    },
    {
        city: "Sultan Sumagka",
        province: "Maguindanao"
    },
    {
        city: "Talayan",
        province: "Maguindanao"
    },
    {
        city: "Upi",
        province: "Maguindanao"
    },
    {
        city: "Boac",
        province: "Marinduque"
    },
    {
        city: "Buenavista",
        province: "Marinduque"
    },
    {
        city: "Gasan",
        province: "Marinduque"
    },
    {
        city: "Mogpog",
        province: "Marinduque"
    },
    {
        city: "Santa Cruz",
        province: "Marinduque"
    },
    {
        city: "Torrijos",
        province: "Marinduque"
    },
    {
        city: "Aroroy",
        province: "Masbate"
    },
    {
        city: "Baleno",
        province: "Masbate"
    },
    {
        city: "Balud",
        province: "Masbate"
    },
    {
        city: "Batuan",
        province: "Masbate"
    },
    {
        city: "Cataingan",
        province: "Masbate"
    },
    {
        city: "Cawayan",
        province: "Masbate"
    },
    {
        city: "Claveria",
        province: "Masbate"
    },
    {
        city: "Dimasalang",
        province: "Masbate"
    },
    {
        city: "Esperanza",
        province: "Masbate"
    },
    {
        city: "Mandaon",
        province: "Masbate"
    },
    {
        city: "Masbate City",
        province: "Masbate"
    },
    {
        city: "Milagros",
        province: "Masbate"
    },
    {
        city: "Mobo",
        province: "Masbate"
    },
    {
        city: "Monreal",
        province: "Masbate"
    },
    {
        city: "Palanas",
        province: "Masbate"
    },
    {
        city: "Pio V. Corpuz",
        province: "Masbate"
    },
    {
        city: "Placer",
        province: "Masbate"
    },
    {
        city: "San Fernando",
        province: "Masbate"
    },
    {
        city: "San Jacinto",
        province: "Masbate"
    },
    {
        city: "San Pascual",
        province: "Masbate"
    },
    {
        city: "Uson",
        province: "Masbate"
    },
    {
        city: "Caloocan",
        province: "Metro Manila"
    },
    {
        city: "Las Piñas",
        province: "Metro Manila"
    },
    {
        city: "Makati",
        province: "Metro Manila"
    },
    {
        city: "Malabon",
        province: "Metro Manila"
    },
    {
        city: "Mandaluyong",
        province: "Metro Manila"
    },
    {
        city: "Manila",
        province: "Metro Manila"
    },
    {
        city: "Marikina",
        province: "Metro Manila"
    },
    {
        city: "Muntinlupa",
        province: "Metro Manila"
    },
    {
        city: "Navotas",
        province: "Metro Manila"
    },
    {
        city: "Parañaque",
        province: "Metro Manila"
    },
    {
        city: "Pasay",
        province: "Metro Manila"
    },
    {
        city: "Pasig",
        province: "Metro Manila"
    },
    {
        city: "Pateros",
        province: "Metro Manila"
    },
    {
        city: "Quezon City",
        province: "Metro Manila"
    },
    {
        city: "San Juan",
        province: "Metro Manila"
    },
    {
        city: "Taguig",
        province: "Metro Manila"
    },
    {
        city: "Valenzuela",
        province: "Metro Manila"
    },
    {
        city: "Aloran",
        province: "Misamis Occidental"
    },
    {
        city: "Baliangao",
        province: "Misamis Occidental"
    },
    {
        city: "Bonifacio",
        province: "Misamis Occidental"
    },
    {
        city: "Calamba",
        province: "Misamis Occidental"
    },
    {
        city: "Clarin",
        province: "Misamis Occidental"
    },
    {
        city: "Concepcion",
        province: "Misamis Occidental"
    },
    {
        city: "Don Victoriano Chiongbian",
        province: "Misamis Occidental"
    },
    {
        city: "Jimenez",
        province: "Misamis Occidental"
    },
    {
        city: "Lopez Jaena",
        province: "Misamis Occidental"
    },
    {
        city: "Oroquieta",
        province: "Misamis Occidental"
    },
    {
        city: "Ozamiz",
        province: "Misamis Occidental"
    },
    {
        city: "Panaon",
        province: "Misamis Occidental"
    },
    {
        city: "Plaridel",
        province: "Misamis Occidental"
    },
    {
        city: "Sapang Dalaga",
        province: "Misamis Occidental"
    },
    {
        city: "Sinacaban",
        province: "Misamis Occidental"
    },
    {
        city: "Tangub",
        province: "Misamis Occidental"
    },
    {
        city: "Tudela",
        province: "Misamis Occidental"
    },
    {
        city: "Alubijid",
        province: "Misamis Oriental"
    },
    {
        city: "Balingasag",
        province: "Misamis Oriental"
    },
    {
        city: "Balingoan",
        province: "Misamis Oriental"
    },
    {
        city: "Binuangan",
        province: "Misamis Oriental"
    },
    {
        city: "Cagayan de Oro",
        province: "Misamis Oriental"
    },
    {
        city: "Claveria",
        province: "Misamis Oriental"
    },
    {
        city: "El Salvador",
        province: "Misamis Oriental"
    },
    {
        city: "Gingoog",
        province: "Misamis Oriental"
    },
    {
        city: "Gitagum",
        province: "Misamis Oriental"
    },
    {
        city: "Initao",
        province: "Misamis Oriental"
    },
    {
        city: "Jasaan",
        province: "Misamis Oriental"
    },
    {
        city: "Kinoguitan",
        province: "Misamis Oriental"
    },
    {
        city: "Lagonglong",
        province: "Misamis Oriental"
    },
    {
        city: "Laguindingan",
        province: "Misamis Oriental"
    },
    {
        city: "Libertad",
        province: "Misamis Oriental"
    },
    {
        city: "Lugait",
        province: "Misamis Oriental"
    },
    {
        city: "Magsaysay",
        province: "Misamis Oriental"
    },
    {
        city: "Manticao",
        province: "Misamis Oriental"
    },
    {
        city: "Medina",
        province: "Misamis Oriental"
    },
    {
        city: "Naawan",
        province: "Misamis Oriental"
    },
    {
        city: "Opol",
        province: "Misamis Oriental"
    },
    {
        city: "Salay",
        province: "Misamis Oriental"
    },
    {
        city: "Sugbongcogon",
        province: "Misamis Oriental"
    },
    {
        city: "Tagoloan",
        province: "Misamis Oriental"
    },
    {
        city: "Talisayan",
        province: "Misamis Oriental"
    },
    {
        city: "Villanueva",
        province: "Misamis Oriental"
    },
    {
        city: "Barlig",
        province: "Mountain Province"
    },
    {
        city: "Bauko",
        province: "Mountain Province"
    },
    {
        city: "Besao",
        province: "Mountain Province"
    },
    {
        city: "Bontoc",
        province: "Mountain Province"
    },
    {
        city: "Natonin",
        province: "Mountain Province"
    },
    {
        city: "Paracelis",
        province: "Mountain Province"
    },
    {
        city: "Sabangan",
        province: "Mountain Province"
    },
    {
        city: "Sadanga",
        province: "Mountain Province"
    },
    {
        city: "Sagada",
        province: "Mountain Province"
    },
    {
        city: "Tadian",
        province: "Mountain Province"
    },
    {
        city: "Bacolod",
        province: "Negros Occidental"
    },
    {
        city: "Bago",
        province: "Negros Occidental"
    },
    {
        city: "Binalbagan",
        province: "Negros Occidental"
    },
    {
        city: "Cadiz",
        province: "Negros Occidental"
    },
    {
        city: "Calatrava",
        province: "Negros Occidental"
    },
    {
        city: "Candoni",
        province: "Negros Occidental"
    },
    {
        city: "Cauayan",
        province: "Negros Occidental"
    },
    {
        city: "Enrique B. Magalona",
        province: "Negros Occidental"
    },
    {
        city: "Escalante",
        province: "Negros Occidental"
    },
    {
        city: "Himamaylan",
        province: "Negros Occidental"
    },
    {
        city: "Hinigaran",
        province: "Negros Occidental"
    },
    {
        city: "Hinoba-an",
        province: "Negros Occidental"
    },
    {
        city: "Ilog",
        province: "Negros Occidental"
    },
    {
        city: "Isabela",
        province: "Negros Occidental"
    },
    {
        city: "Kabankalan",
        province: "Negros Occidental"
    },
    {
        city: "La Carlota",
        province: "Negros Occidental"
    },
    {
        city: "La Castellana",
        province: "Negros Occidental"
    },
    {
        city: "Manapla",
        province: "Negros Occidental"
    },
    {
        city: "Moises Padilla",
        province: "Negros Occidental"
    },
    {
        city: "Murcia",
        province: "Negros Occidental"
    },
    {
        city: "Pontevedra",
        province: "Negros Occidental"
    },
    {
        city: "Pulupandan",
        province: "Negros Occidental"
    },
    {
        city: "Sagay",
        province: "Negros Occidental"
    },
    {
        city: "Salvador Benedicto",
        province: "Negros Occidental"
    },
    {
        city: "San Carlos",
        province: "Negros Occidental"
    },
    {
        city: "San Enrique",
        province: "Negros Occidental"
    },
    {
        city: "Silay",
        province: "Negros Occidental"
    },
    {
        city: "Sipalay",
        province: "Negros Occidental"
    },
    {
        city: "Talisay",
        province: "Negros Occidental"
    },
    {
        city: "Toboso",
        province: "Negros Occidental"
    },
    {
        city: "Valladolid",
        province: "Negros Occidental"
    },
    {
        city: "Victorias",
        province: "Negros Occidental"
    },
    {
        city: "Amlan",
        province: "Negros Oriental"
    },
    {
        city: "Ayungon",
        province: "Negros Oriental"
    },
    {
        city: "Bacong",
        province: "Negros Oriental"
    },
    {
        city: "Bais",
        province: "Negros Oriental"
    },
    {
        city: "Basay",
        province: "Negros Oriental"
    },
    {
        city: "Bayawan",
        province: "Negros Oriental"
    },
    {
        city: "Bindoy",
        province: "Negros Oriental"
    },
    {
        city: "Canlaon",
        province: "Negros Oriental"
    },
    {
        city: "Dauin",
        province: "Negros Oriental"
    },
    {
        city: "Dumaguete",
        province: "Negros Oriental"
    },
    {
        city: "Guihulngan",
        province: "Negros Oriental"
    },
    {
        city: "Jimalalud",
        province: "Negros Oriental"
    },
    {
        city: "La Libertad",
        province: "Negros Oriental"
    },
    {
        city: "Mabinay",
        province: "Negros Oriental"
    },
    {
        city: "Manjuyod",
        province: "Negros Oriental"
    },
    {
        city: "Pamplona",
        province: "Negros Oriental"
    },
    {
        city: "San Jose",
        province: "Negros Oriental"
    },
    {
        city: "Santa Catalina",
        province: "Negros Oriental"
    },
    {
        city: "Siaton",
        province: "Negros Oriental"
    },
    {
        city: "Sibulan",
        province: "Negros Oriental"
    },
    {
        city: "Tanjay",
        province: "Negros Oriental"
    },
    {
        city: "Tayasan",
        province: "Negros Oriental"
    },
    {
        city: "Valencia",
        province: "Negros Oriental"
    },
    {
        city: "Vallehermoso",
        province: "Negros Oriental"
    },
    {
        city: "Zamboanguita",
        province: "Negros Oriental"
    },
    {
        city: "Allen",
        province: "Northern Samar"
    },
    {
        city: "Biri",
        province: "Northern Samar"
    },
    {
        city: "Bobon",
        province: "Northern Samar"
    },
    {
        city: "Capul",
        province: "Northern Samar"
    },
    {
        city: "Catarman",
        province: "Northern Samar"
    },
    {
        city: "Catubig",
        province: "Northern Samar"
    },
    {
        city: "Gamay",
        province: "Northern Samar"
    },
    {
        city: "Laoang",
        province: "Northern Samar"
    },
    {
        city: "Lapinig",
        province: "Northern Samar"
    },
    {
        city: "Las Navas",
        province: "Northern Samar"
    },
    {
        city: "Lavezares",
        province: "Northern Samar"
    },
    {
        city: "Lope de Vega",
        province: "Northern Samar"
    },
    {
        city: "Mapanas",
        province: "Northern Samar"
    },
    {
        city: "Mondragon",
        province: "Northern Samar"
    },
    {
        city: "Palapag",
        province: "Northern Samar"
    },
    {
        city: "Pambujan",
        province: "Northern Samar"
    },
    {
        city: "Rosario",
        province: "Northern Samar"
    },
    {
        city: "San Antonio",
        province: "Northern Samar"
    },
    {
        city: "San Isidro",
        province: "Northern Samar"
    },
    {
        city: "San Jose",
        province: "Northern Samar"
    },
    {
        city: "San Roque",
        province: "Northern Samar"
    },
    {
        city: "San Vicente",
        province: "Northern Samar"
    },
    {
        city: "Silvino Lobos",
        province: "Northern Samar"
    },
    {
        city: "Victoria",
        province: "Northern Samar"
    },
    {
        city: "Aliaga",
        province: "Nueva Ecija"
    },
    {
        city: "Bongabon",
        province: "Nueva Ecija"
    },
    {
        city: "Cabanatuan",
        province: "Nueva Ecija"
    },
    {
        city: "Cabiao",
        province: "Nueva Ecija"
    },
    {
        city: "Carranglan",
        province: "Nueva Ecija"
    },
    {
        city: "Cuyapo",
        province: "Nueva Ecija"
    },
    {
        city: "Gabaldon",
        province: "Nueva Ecija"
    },
    {
        city: "Gapan",
        province: "Nueva Ecija"
    },
    {
        city: "General Mamerto Natividad",
        province: "Nueva Ecija"
    },
    {
        city: "General Tinio",
        province: "Nueva Ecija"
    },
    {
        city: "Guimba",
        province: "Nueva Ecija"
    },
    {
        city: "Jaen",
        province: "Nueva Ecija"
    },
    {
        city: "Laur",
        province: "Nueva Ecija"
    },
    {
        city: "Licab",
        province: "Nueva Ecija"
    },
    {
        city: "Llanera",
        province: "Nueva Ecija"
    },
    {
        city: "Lupao",
        province: "Nueva Ecija"
    },
    {
        city: "Muñoz",
        province: "Nueva Ecija"
    },
    {
        city: "Nampicuan",
        province: "Nueva Ecija"
    },
    {
        city: "Palayan",
        province: "Nueva Ecija"
    },
    {
        city: "Pantabangan",
        province: "Nueva Ecija"
    },
    {
        city: "Peñaranda",
        province: "Nueva Ecija"
    },
    {
        city: "Quezon",
        province: "Nueva Ecija"
    },
    {
        city: "Rizal",
        province: "Nueva Ecija"
    },
    {
        city: "San Antonio",
        province: "Nueva Ecija"
    },
    {
        city: "San Isidro",
        province: "Nueva Ecija"
    },
    {
        city: "San Jose",
        province: "Nueva Ecija"
    },
    {
        city: "San Leonardo",
        province: "Nueva Ecija"
    },
    {
        city: "Santa Rosa",
        province: "Nueva Ecija"
    },
    {
        city: "Santo Domingo",
        province: "Nueva Ecija"
    },
    {
        city: "Talavera",
        province: "Nueva Ecija"
    },
    {
        city: "Talugtug",
        province: "Nueva Ecija"
    },
    {
        city: "Zaragoza",
        province: "Nueva Ecija"
    },
    {
        city: "Alfonso Castañeda",
        province: "Nueva Vizcaya"
    },
    {
        city: "Ambaguio",
        province: "Nueva Vizcaya"
    },
    {
        city: "Aritao",
        province: "Nueva Vizcaya"
    },
    {
        city: "Bagabag",
        province: "Nueva Vizcaya"
    },
    {
        city: "Bambang",
        province: "Nueva Vizcaya"
    },
    {
        city: "Bayombong",
        province: "Nueva Vizcaya"
    },
    {
        city: "Diadi",
        province: "Nueva Vizcaya"
    },
    {
        city: "Dupax del Norte",
        province: "Nueva Vizcaya"
    },
    {
        city: "Dupax del Sur",
        province: "Nueva Vizcaya"
    },
    {
        city: "Kasibu",
        province: "Nueva Vizcaya"
    },
    {
        city: "Kayapa",
        province: "Nueva Vizcaya"
    },
    {
        city: "Quezon",
        province: "Nueva Vizcaya"
    },
    {
        city: "Santa Fe",
        province: "Nueva Vizcaya"
    },
    {
        city: "Solano",
        province: "Nueva Vizcaya"
    },
    {
        city: "Villaverde",
        province: "Nueva Vizcaya"
    },
    {
        city: "Abra de Ilog",
        province: "Occidental Mindoro"
    },
    {
        city: "Calintaan",
        province: "Occidental Mindoro"
    },
    {
        city: "Looc",
        province: "Occidental Mindoro"
    },
    {
        city: "Lubang",
        province: "Occidental Mindoro"
    },
    {
        city: "Magsaysay",
        province: "Occidental Mindoro"
    },
    {
        city: "Mamburao",
        province: "Occidental Mindoro"
    },
    {
        city: "Paluan",
        province: "Occidental Mindoro"
    },
    {
        city: "Rizal",
        province: "Occidental Mindoro"
    },
    {
        city: "Sablayan",
        province: "Occidental Mindoro"
    },
    {
        city: "San Jose",
        province: "Occidental Mindoro"
    },
    {
        city: "Santa Cruz",
        province: "Occidental Mindoro"
    },
    {
        city: "Baco",
        province: "Oriental Mindoro"
    },
    {
        city: "Bansud",
        province: "Oriental Mindoro"
    },
    {
        city: "Bongabong",
        province: "Oriental Mindoro"
    },
    {
        city: "Bulalacao",
        province: "Oriental Mindoro"
    },
    {
        city: "Calapan",
        province: "Oriental Mindoro"
    },
    {
        city: "Gloria",
        province: "Oriental Mindoro"
    },
    {
        city: "Mansalay",
        province: "Oriental Mindoro"
    },
    {
        city: "Naujan",
        province: "Oriental Mindoro"
    },
    {
        city: "Pinamalayan",
        province: "Oriental Mindoro"
    },
    {
        city: "Pola",
        province: "Oriental Mindoro"
    },
    {
        city: "Puerto Galera",
        province: "Oriental Mindoro"
    },
    {
        city: "Roxas",
        province: "Oriental Mindoro"
    },
    {
        city: "San Teodoro",
        province: "Oriental Mindoro"
    },
    {
        city: "Socorro",
        province: "Oriental Mindoro"
    },
    {
        city: "Victoria",
        province: "Oriental Mindoro"
    },
    {
        city: "Aborlan",
        province: "Palawan"
    },
    {
        city: "Agutaya",
        province: "Palawan"
    },
    {
        city: "Araceli",
        province: "Palawan"
    },
    {
        city: "Balabac",
        province: "Palawan"
    },
    {
        city: "Bataraza",
        province: "Palawan"
    },
    {
        city: "Brooke's Point",
        province: "Palawan"
    },
    {
        city: "Busuanga",
        province: "Palawan"
    },
    {
        city: "Cagayancillo",
        province: "Palawan"
    },
    {
        city: "Coron",
        province: "Palawan"
    },
    {
        city: "Culion",
        province: "Palawan"
    },
    {
        city: "Cuyo",
        province: "Palawan"
    },
    {
        city: "Dumaran",
        province: "Palawan"
    },
    {
        city: "El Nido",
        province: "Palawan"
    },
    {
        city: "Kalayaan",
        province: "Palawan"
    },
    {
        city: "Linapacan",
        province: "Palawan"
    },
    {
        city: "Magsaysay",
        province: "Palawan"
    },
    {
        city: "Narra",
        province: "Palawan"
    },
    {
        city: "Puerto Princesa",
        province: "Palawan"
    },
    {
        city: "Quezon",
        province: "Palawan"
    },
    {
        city: "Rizal",
        province: "Palawan"
    },
    {
        city: "Roxas, Palawan",
        province: "Palawan"
    },
    {
        city: "San Vicente",
        province: "Palawan"
    },
    {
        city: "Sofronio Española",
        province: "Palawan"
    },
    {
        city: "Taytay",
        province: "Palawan"
    },
    {
        city: "Angeles",
        province: "Pampanga"
    },
    {
        city: "Apalit",
        province: "Pampanga"
    },
    {
        city: "Arayat",
        province: "Pampanga"
    },
    {
        city: "Bacolor",
        province: "Pampanga"
    },
    {
        city: "Candaba",
        province: "Pampanga"
    },
    {
        city: "Floridablanca",
        province: "Pampanga"
    },
    {
        city: "Guagua",
        province: "Pampanga"
    },
    {
        city: "Lubao",
        province: "Pampanga"
    },
    {
        city: "Mabalacat",
        province: "Pampanga"
    },
    {
        city: "Macabebe",
        province: "Pampanga"
    },
    {
        city: "Magalang",
        province: "Pampanga"
    },
    {
        city: "Masantol",
        province: "Pampanga"
    },
    {
        city: "Mexico",
        province: "Pampanga"
    },
    {
        city: "Minalin",
        province: "Pampanga"
    },
    {
        city: "Porac",
        province: "Pampanga"
    },
    {
        city: "San Fernando",
        province: "Pampanga"
    },
    {
        city: "San Luis",
        province: "Pampanga"
    },
    {
        city: "San Simon",
        province: "Pampanga"
    },
    {
        city: "Santa Ana",
        province: "Pampanga"
    },
    {
        city: "Santa Rita",
        province: "Pampanga"
    },
    {
        city: "Santo Tomas",
        province: "Pampanga"
    },
    {
        city: "Sasmuan",
        province: "Pampanga"
    },
    {
        city: "Agno",
        province: "Pangasinan"
    },
    {
        city: "Aguilar",
        province: "Pangasinan"
    },
    {
        city: "Alaminos",
        province: "Pangasinan"
    },
    {
        city: "Alcala",
        province: "Pangasinan"
    },
    {
        city: "Anda",
        province: "Pangasinan"
    },
    {
        city: "Asingan",
        province: "Pangasinan"
    },
    {
        city: "Balungao",
        province: "Pangasinan"
    },
    {
        city: "Bani",
        province: "Pangasinan"
    },
    {
        city: "Basista",
        province: "Pangasinan"
    },
    {
        city: "Bautista",
        province: "Pangasinan"
    },
    {
        city: "Bayambang",
        province: "Pangasinan"
    },
    {
        city: "Binalonan",
        province: "Pangasinan"
    },
    {
        city: "Binmaley",
        province: "Pangasinan"
    },
    {
        city: "Bolinao",
        province: "Pangasinan"
    },
    {
        city: "Bugallon",
        province: "Pangasinan"
    },
    {
        city: "Burgos",
        province: "Pangasinan"
    },
    {
        city: "Calasiao",
        province: "Pangasinan"
    },
    {
        city: "Dagupan",
        province: "Pangasinan"
    },
    {
        city: "Dasol",
        province: "Pangasinan"
    },
    {
        city: "Infanta",
        province: "Pangasinan"
    },
    {
        city: "Labrador",
        province: "Pangasinan"
    },
    {
        city: "Laoac",
        province: "Pangasinan"
    },
    {
        city: "Lingayen",
        province: "Pangasinan"
    },
    {
        city: "Mabini",
        province: "Pangasinan"
    },
    {
        city: "Malasiqui",
        province: "Pangasinan"
    },
    {
        city: "Manaoag",
        province: "Pangasinan"
    },
    {
        city: "Mangaldan",
        province: "Pangasinan"
    },
    {
        city: "Mangatarem",
        province: "Pangasinan"
    },
    {
        city: "Mapandan",
        province: "Pangasinan"
    },
    {
        city: "Natividad",
        province: "Pangasinan"
    },
    {
        city: "Pozorrubio",
        province: "Pangasinan"
    },
    {
        city: "Rosales",
        province: "Pangasinan"
    },
    {
        city: "San Carlos",
        province: "Pangasinan"
    },
    {
        city: "San Fabian",
        province: "Pangasinan"
    },
    {
        city: "San Jacinto",
        province: "Pangasinan"
    },
    {
        city: "San Manuel",
        province: "Pangasinan"
    },
    {
        city: "San Nicolas",
        province: "Pangasinan"
    },
    {
        city: "San Quintin",
        province: "Pangasinan"
    },
    {
        city: "Santa Barbara",
        province: "Pangasinan"
    },
    {
        city: "Santa Maria",
        province: "Pangasinan"
    },
    {
        city: "Santo Tomas",
        province: "Pangasinan"
    },
    {
        city: "Sison",
        province: "Pangasinan"
    },
    {
        city: "Sual",
        province: "Pangasinan"
    },
    {
        city: "Tayug",
        province: "Pangasinan"
    },
    {
        city: "Umingan",
        province: "Pangasinan"
    },
    {
        city: "Urbiztondo",
        province: "Pangasinan"
    },
    {
        city: "Urdaneta",
        province: "Pangasinan"
    },
    {
        city: "Villasis",
        province: "Pangasinan"
    },
    {
        city: "Agdangan",
        province: "Quezon"
    },
    {
        city: "Alabat",
        province: "Quezon"
    },
    {
        city: "Atimonan",
        province: "Quezon"
    },
    {
        city: "Buenavista",
        province: "Quezon"
    },
    {
        city: "Burdeos",
        province: "Quezon"
    },
    {
        city: "Calauag",
        province: "Quezon"
    },
    {
        city: "Candelaria",
        province: "Quezon"
    },
    {
        city: "Catanauan",
        province: "Quezon"
    },
    {
        city: "Dolores",
        province: "Quezon"
    },
    {
        city: "General Luna",
        province: "Quezon"
    },
    {
        city: "General Nakar",
        province: "Quezon"
    },
    {
        city: "Guinayangan",
        province: "Quezon"
    },
    {
        city: "Gumaca",
        province: "Quezon"
    },
    {
        city: "Infanta",
        province: "Quezon"
    },
    {
        city: "Jomalig",
        province: "Quezon"
    },
    {
        city: "Lopez",
        province: "Quezon"
    },
    {
        city: "Lucban",
        province: "Quezon"
    },
    {
        city: "Lucena",
        province: "Quezon"
    },
    {
        city: "Macalelon",
        province: "Quezon"
    },
    {
        city: "Mauban",
        province: "Quezon"
    },
    {
        city: "Mulanay",
        province: "Quezon"
    },
    {
        city: "Padre Burgos",
        province: "Quezon"
    },
    {
        city: "Pagbilao",
        province: "Quezon"
    },
    {
        city: "Panukulan",
        province: "Quezon"
    },
    {
        city: "Patnanungan",
        province: "Quezon"
    },
    {
        city: "Perez",
        province: "Quezon"
    },
    {
        city: "Pitogo",
        province: "Quezon"
    },
    {
        city: "Plaridel",
        province: "Quezon"
    },
    {
        city: "Polillo",
        province: "Quezon"
    },
    {
        city: "Quezon",
        province: "Quezon"
    },
    {
        city: "Real",
        province: "Quezon"
    },
    {
        city: "Sampaloc",
        province: "Quezon"
    },
    {
        city: "San Andres",
        province: "Quezon"
    },
    {
        city: "San Antonio",
        province: "Quezon"
    },
    {
        city: "San Francisco",
        province: "Quezon"
    },
    {
        city: "San Narciso",
        province: "Quezon"
    },
    {
        city: "Sariaya",
        province: "Quezon"
    },
    {
        city: "Tagkawayan",
        province: "Quezon"
    },
    {
        city: "Tayabas",
        province: "Quezon"
    },
    {
        city: "Tiaong",
        province: "Quezon"
    },
    {
        city: "Unisan",
        province: "Quezon"
    },
    {
        city: "Aglipay",
        province: "Quirino"
    },
    {
        city: "Cabarroguis",
        province: "Quirino"
    },
    {
        city: "Diffun",
        province: "Quirino"
    },
    {
        city: "Maddela",
        province: "Quirino"
    },
    {
        city: "Nagtipunan",
        province: "Quirino"
    },
    {
        city: "Saguday",
        province: "Quirino"
    },
    {
        city: "Angono",
        province: "Rizal"
    },
    {
        city: "Antipolo",
        province: "Rizal"
    },
    {
        city: "Baras",
        province: "Rizal"
    },
    {
        city: "Binangonan",
        province: "Rizal"
    },
    {
        city: "Cainta",
        province: "Rizal"
    },
    {
        city: "Cardona",
        province: "Rizal"
    },
    {
        city: "Jalajala",
        province: "Rizal"
    },
    {
        city: "Morong",
        province: "Rizal"
    },
    {
        city: "Pililla",
        province: "Rizal"
    },
    {
        city: "Rodriguez",
        province: "Rizal"
    },
    {
        city: "San Mateo",
        province: "Rizal"
    },
    {
        city: "Tanay",
        province: "Rizal"
    },
    {
        city: "Taytay",
        province: "Rizal"
    },
    {
        city: "Teresa",
        province: "Rizal"
    },
    {
        city: "Alcantara",
        province: "Romblon"
    },
    {
        city: "Banton",
        province: "Romblon"
    },
    {
        city: "Cajidiocan",
        province: "Romblon"
    },
    {
        city: "Calatrava",
        province: "Romblon"
    },
    {
        city: "Concepcion",
        province: "Romblon"
    },
    {
        city: "Corcuera",
        province: "Romblon"
    },
    {
        city: "Ferrol",
        province: "Romblon"
    },
    {
        city: "Looc",
        province: "Romblon"
    },
    {
        city: "Magdiwang",
        province: "Romblon"
    },
    {
        city: "Odiongan",
        province: "Romblon"
    },
    {
        city: "Romblon",
        province: "Romblon"
    },
    {
        city: "San Agustin",
        province: "Romblon"
    },
    {
        city: "San Andres",
        province: "Romblon"
    },
    {
        city: "San Fernando",
        province: "Romblon"
    },
    {
        city: "San Jose",
        province: "Romblon"
    },
    {
        city: "Santa Fe",
        province: "Romblon"
    },
    {
        city: "Santa Maria",
        province: "Romblon"
    },
    {
        city: "Almagro",
        province: "Samar"
    },
    {
        city: "Basey",
        province: "Samar"
    },
    {
        city: "Calbayog",
        province: "Samar"
    },
    {
        city: "Calbiga",
        province: "Samar"
    },
    {
        city: "Catbalogan",
        province: "Samar"
    },
    {
        city: "Daram",
        province: "Samar"
    },
    {
        city: "Gandara",
        province: "Samar"
    },
    {
        city: "Hinabangan",
        province: "Samar"
    },
    {
        city: "Jiabong",
        province: "Samar"
    },
    {
        city: "Marabut",
        province: "Samar"
    },
    {
        city: "Matuguinao",
        province: "Samar"
    },
    {
        city: "Motiong",
        province: "Samar"
    },
    {
        city: "Pagsanghan",
        province: "Samar"
    },
    {
        city: "Paranas",
        province: "Samar"
    },
    {
        city: "Pinabacdao",
        province: "Samar"
    },
    {
        city: "San Jorge",
        province: "Samar"
    },
    {
        city: "San Jose de Buan",
        province: "Samar"
    },
    {
        city: "San Sebastian",
        province: "Samar"
    },
    {
        city: "Santa Margarita",
        province: "Samar"
    },
    {
        city: "Santa Rita",
        province: "Samar"
    },
    {
        city: "Santo Niño",
        province: "Samar"
    },
    {
        city: "Tagapul-an",
        province: "Samar"
    },
    {
        city: "Talalora",
        province: "Samar"
    },
    {
        city: "Tarangnan",
        province: "Samar"
    },
    {
        city: "Villareal",
        province: "Samar"
    },
    {
        city: "Zumarraga",
        province: "Samar"
    },
    {
        city: "Alabel",
        province: "Sarangani"
    },
    {
        city: "Glan",
        province: "Sarangani"
    },
    {
        city: "Kiamba",
        province: "Sarangani"
    },
    {
        city: "Maasim",
        province: "Sarangani"
    },
    {
        city: "Maitum",
        province: "Sarangani"
    },
    {
        city: "Malapatan",
        province: "Sarangani"
    },
    {
        city: "Malungon",
        province: "Sarangani"
    },
    {
        city: "Enrique Villanueva",
        province: "Siquijor"
    },
    {
        city: "Larena",
        province: "Siquijor"
    },
    {
        city: "Lazi",
        province: "Siquijor"
    },
    {
        city: "Maria",
        province: "Siquijor"
    },
    {
        city: "San Juan",
        province: "Siquijor"
    },
    {
        city: "Siquijor",
        province: "Siquijor"
    },
    {
        city: "Barcelona",
        province: "Sorsogon"
    },
    {
        city: "Bulan",
        province: "Sorsogon"
    },
    {
        city: "Bulusan",
        province: "Sorsogon"
    },
    {
        city: "Casiguran",
        province: "Sorsogon"
    },
    {
        city: "Castilla",
        province: "Sorsogon"
    },
    {
        city: "Donsol",
        province: "Sorsogon"
    },
    {
        city: "Gubat",
        province: "Sorsogon"
    },
    {
        city: "Irosin",
        province: "Sorsogon"
    },
    {
        city: "Juban",
        province: "Sorsogon"
    },
    {
        city: "Magallanes",
        province: "Sorsogon"
    },
    {
        city: "Matnog",
        province: "Sorsogon"
    },
    {
        city: "Pilar",
        province: "Sorsogon"
    },
    {
        city: "Prieto Diaz",
        province: "Sorsogon"
    },
    {
        city: "Santa Magdalena",
        province: "Sorsogon"
    },
    {
        city: "Sorsogon City",
        province: "Sorsogon"
    },
    {
        city: "Banga",
        province: "South Cotabato"
    },
    {
        city: "General Santos",
        province: "South Cotabato"
    },
    {
        city: "Koronadal",
        province: "South Cotabato"
    },
    {
        city: "Lake Sebu",
        province: "South Cotabato"
    },
    {
        city: "Norala",
        province: "South Cotabato"
    },
    {
        city: "Polomolok",
        province: "South Cotabato"
    },
    {
        city: "Santo Niño",
        province: "South Cotabato"
    },
    {
        city: "Surallah",
        province: "South Cotabato"
    },
    {
        city: "T'Boli",
        province: "South Cotabato"
    },
    {
        city: "Tampakan",
        province: "South Cotabato"
    },
    {
        city: "Tantangan",
        province: "South Cotabato"
    },
    {
        city: "Tupi",
        province: "South Cotabato"
    },
    {
        city: "Anahawan",
        province: "Southern Leyte"
    },
    {
        city: "Bontoc",
        province: "Southern Leyte"
    },
    {
        city: "Hinunangan",
        province: "Southern Leyte"
    },
    {
        city: "Hinundayan",
        province: "Southern Leyte"
    },
    {
        city: "Libagon",
        province: "Southern Leyte"
    },
    {
        city: "Liloan",
        province: "Southern Leyte"
    },
    {
        city: "Limasawa",
        province: "Southern Leyte"
    },
    {
        city: "Maasin",
        province: "Southern Leyte"
    },
    {
        city: "Macrohon",
        province: "Southern Leyte"
    },
    {
        city: "Malitbog",
        province: "Southern Leyte"
    },
    {
        city: "Padre Burgos",
        province: "Southern Leyte"
    },
    {
        city: "Pintuyan",
        province: "Southern Leyte"
    },
    {
        city: "Saint Bernard",
        province: "Southern Leyte"
    },
    {
        city: "San Francisco",
        province: "Southern Leyte"
    },
    {
        city: "San Juan",
        province: "Southern Leyte"
    },
    {
        city: "San Ricardo",
        province: "Southern Leyte"
    },
    {
        city: "Silago",
        province: "Southern Leyte"
    },
    {
        city: "Sogod",
        province: "Southern Leyte"
    },
    {
        city: "Tomas Oppus",
        province: "Southern Leyte"
    },
    {
        city: "Bagumbayan",
        province: "Sultan Kudarat"
    },
    {
        city: "Columbio",
        province: "Sultan Kudarat"
    },
    {
        city: "Esperanza",
        province: "Sultan Kudarat"
    },
    {
        city: "Isulan",
        province: "Sultan Kudarat"
    },
    {
        city: "Kalamansig",
        province: "Sultan Kudarat"
    },
    {
        city: "Lambayong",
        province: "Sultan Kudarat"
    },
    {
        city: "Lebak",
        province: "Sultan Kudarat"
    },
    {
        city: "Lutayan",
        province: "Sultan Kudarat"
    },
    {
        city: "Palimbang",
        province: "Sultan Kudarat"
    },
    {
        city: "President Quirino",
        province: "Sultan Kudarat"
    },
    {
        city: "Senator Ninoy Aquino",
        province: "Sultan Kudarat"
    },
    {
        city: "Tacurong",
        province: "Sultan Kudarat"
    },
    {
        city: "Banguingui",
        province: "Sulu"
    },
    {
        city: "Hadji Panglima Tahil",
        province: "Sulu"
    },
    {
        city: "Indanan",
        province: "Sulu"
    },
    {
        city: "Jolo",
        province: "Sulu"
    },
    {
        city: "Kalingalan Caluang",
        province: "Sulu"
    },
    {
        city: "Lugus",
        province: "Sulu"
    },
    {
        city: "Luuk",
        province: "Sulu"
    },
    {
        city: "Maimbung",
        province: "Sulu"
    },
    {
        city: "Omar",
        province: "Sulu"
    },
    {
        city: "Panamao",
        province: "Sulu"
    },
    {
        city: "Pandami",
        province: "Sulu"
    },
    {
        city: "Panglima Estino",
        province: "Sulu"
    },
    {
        city: "Pangutaran",
        province: "Sulu"
    },
    {
        city: "Parang",
        province: "Sulu"
    },
    {
        city: "Pata",
        province: "Sulu"
    },
    {
        city: "Patikul",
        province: "Sulu"
    },
    {
        city: "Siasi",
        province: "Sulu"
    },
    {
        city: "Talipao",
        province: "Sulu"
    },
    {
        city: "Tapul",
        province: "Sulu"
    },
    {
        city: "Alegria",
        province: "Surigao del Norte"
    },
    {
        city: "Bacuag",
        province: "Surigao del Norte"
    },
    {
        city: "Burgos",
        province: "Surigao del Norte"
    },
    {
        city: "Claver",
        province: "Surigao del Norte"
    },
    {
        city: "Dapa",
        province: "Surigao del Norte"
    },
    {
        city: "Del Carmen",
        province: "Surigao del Norte"
    },
    {
        city: "General Luna",
        province: "Surigao del Norte"
    },
    {
        city: "Gigaquit",
        province: "Surigao del Norte"
    },
    {
        city: "Mainit",
        province: "Surigao del Norte"
    },
    {
        city: "Malimono",
        province: "Surigao del Norte"
    },
    {
        city: "Pilar",
        province: "Surigao del Norte"
    },
    {
        city: "Placer",
        province: "Surigao del Norte"
    },
    {
        city: "San Benito",
        province: "Surigao del Norte"
    },
    {
        city: "San Francisco",
        province: "Surigao del Norte"
    },
    {
        city: "San Isidro",
        province: "Surigao del Norte"
    },
    {
        city: "Santa Monica",
        province: "Surigao del Norte"
    },
    {
        city: "Sison",
        province: "Surigao del Norte"
    },
    {
        city: "Socorro",
        province: "Surigao del Norte"
    },
    {
        city: "Surigao City",
        province: "Surigao del Norte"
    },
    {
        city: "Tagana-an",
        province: "Surigao del Norte"
    },
    {
        city: "Tubod",
        province: "Surigao del Norte"
    },
    {
        city: "Barobo",
        province: "Surigao del Sur"
    },
    {
        city: "Bayabas",
        province: "Surigao del Sur"
    },
    {
        city: "Bislig",
        province: "Surigao del Sur"
    },
    {
        city: "Cagwait",
        province: "Surigao del Sur"
    },
    {
        city: "Cantilan",
        province: "Surigao del Sur"
    },
    {
        city: "Carmen",
        province: "Surigao del Sur"
    },
    {
        city: "Carrascal",
        province: "Surigao del Sur"
    },
    {
        city: "Cortes",
        province: "Surigao del Sur"
    },
    {
        city: "Hinatuan",
        province: "Surigao del Sur"
    },
    {
        city: "Lanuza",
        province: "Surigao del Sur"
    },
    {
        city: "Lianga",
        province: "Surigao del Sur"
    },
    {
        city: "Lingig",
        province: "Surigao del Sur"
    },
    {
        city: "Madrid",
        province: "Surigao del Sur"
    },
    {
        city: "Marihatag",
        province: "Surigao del Sur"
    },
    {
        city: "San Agustin",
        province: "Surigao del Sur"
    },
    {
        city: "San Miguel",
        province: "Surigao del Sur"
    },
    {
        city: "Tagbina",
        province: "Surigao del Sur"
    },
    {
        city: "Tago",
        province: "Surigao del Sur"
    },
    {
        city: "Tandag",
        province: "Surigao del Sur"
    },
    {
        city: "Anao",
        province: "Tarlac"
    },
    {
        city: "Bamban",
        province: "Tarlac"
    },
    {
        city: "Camiling",
        province: "Tarlac"
    },
    {
        city: "Capas",
        province: "Tarlac"
    },
    {
        city: "Concepcion",
        province: "Tarlac"
    },
    {
        city: "Gerona",
        province: "Tarlac"
    },
    {
        city: "La Paz",
        province: "Tarlac"
    },
    {
        city: "Mayantoc",
        province: "Tarlac"
    },
    {
        city: "Moncada",
        province: "Tarlac"
    },
    {
        city: "Paniqui",
        province: "Tarlac"
    },
    {
        city: "Pura",
        province: "Tarlac"
    },
    {
        city: "Ramos",
        province: "Tarlac"
    },
    {
        city: "San Clemente",
        province: "Tarlac"
    },
    {
        city: "San Jose",
        province: "Tarlac"
    },
    {
        city: "San Manuel",
        province: "Tarlac"
    },
    {
        city: "Santa Ignacia",
        province: "Tarlac"
    },
    {
        city: "Tarlac City",
        province: "Tarlac"
    },
    {
        city: "Victoria",
        province: "Tarlac"
    },
    {
        city: "Bongao",
        province: "Tawi-Tawi"
    },
    {
        city: "Languyan",
        province: "Tawi-Tawi"
    },
    {
        city: "Mapun",
        province: "Tawi-Tawi"
    },
    {
        city: "Panglima Sugala",
        province: "Tawi-Tawi"
    },
    {
        city: "Sapa-Sapa",
        province: "Tawi-Tawi"
    },
    {
        city: "Sibutu",
        province: "Tawi-Tawi"
    },
    {
        city: "Simunul",
        province: "Tawi-Tawi"
    },
    {
        city: "Sitangkai",
        province: "Tawi-Tawi"
    },
    {
        city: "South Ubian",
        province: "Tawi-Tawi"
    },
    {
        city: "Tandubas",
        province: "Tawi-Tawi"
    },
    {
        city: "Turtle Islands",
        province: "Tawi-Tawi"
    },
    {
        city: "Botolan",
        province: "Zambales"
    },
    {
        city: "Cabangan",
        province: "Zambales"
    },
    {
        city: "Candelaria",
        province: "Zambales"
    },
    {
        city: "Castillejos",
        province: "Zambales"
    },
    {
        city: "Iba",
        province: "Zambales"
    },
    {
        city: "Masinloc",
        province: "Zambales"
    },
    {
        city: "Olongapo",
        province: "Zambales"
    },
    {
        city: "Palauig",
        province: "Zambales"
    },
    {
        city: "San Antonio",
        province: "Zambales"
    },
    {
        city: "San Felipe",
        province: "Zambales"
    },
    {
        city: "San Marcelino",
        province: "Zambales"
    },
    {
        city: "San Narciso",
        province: "Zambales"
    },
    {
        city: "Santa Cruz",
        province: "Zambales"
    },
    {
        city: "Subic",
        province: "Zambales"
    },
    {
        city: "Baliguian",
        province: "Zamboanga del Norte"
    },
    {
        city: "Dapitan",
        province: "Zamboanga del Norte"
    },
    {
        city: "Dipolog",
        province: "Zamboanga del Norte"
    },
    {
        city: "Godod",
        province: "Zamboanga del Norte"
    },
    {
        city: "Gutalac",
        province: "Zamboanga del Norte"
    },
    {
        city: "Jose Dalman",
        province: "Zamboanga del Norte"
    },
    {
        city: "Kalawit",
        province: "Zamboanga del Norte"
    },
    {
        city: "Katipunan",
        province: "Zamboanga del Norte"
    },
    {
        city: "La Libertad",
        province: "Zamboanga del Norte"
    },
    {
        city: "Labason",
        province: "Zamboanga del Norte"
    },
    {
        city: "Leon B. Postigo",
        province: "Zamboanga del Norte"
    },
    {
        city: "Liloy",
        province: "Zamboanga del Norte"
    },
    {
        city: "Manukan",
        province: "Zamboanga del Norte"
    },
    {
        city: "Mutia",
        province: "Zamboanga del Norte"
    },
    {
        city: "Piñan",
        province: "Zamboanga del Norte"
    },
    {
        city: "Polanco",
        province: "Zamboanga del Norte"
    },
    {
        city: "Rizal",
        province: "Zamboanga del Norte"
    },
    {
        city: "Roxas",
        province: "Zamboanga del Norte"
    },
    {
        city: "Salug",
        province: "Zamboanga del Norte"
    },
    {
        city: "Sergio Osmeña",
        province: "Zamboanga del Norte"
    },
    {
        city: "Siayan",
        province: "Zamboanga del Norte"
    },
    {
        city: "Sibuco",
        province: "Zamboanga del Norte"
    },
    {
        city: "Sibutad",
        province: "Zamboanga del Norte"
    },
    {
        city: "Sindangan",
        province: "Zamboanga del Norte"
    },
    {
        city: "Siocon",
        province: "Zamboanga del Norte"
    },
    {
        city: "Sirawai",
        province: "Zamboanga del Norte"
    },
    {
        city: "Tampilisan",
        province: "Zamboanga del Norte"
    },
    {
        city: "Aurora",
        province: "Zamboanga del Sur"
    },
    {
        city: "Bayog",
        province: "Zamboanga del Sur"
    },
    {
        city: "Dimataling",
        province: "Zamboanga del Sur"
    },
    {
        city: "Dinas",
        province: "Zamboanga del Sur"
    },
    {
        city: "Dumalinao",
        province: "Zamboanga del Sur"
    },
    {
        city: "Dumingag",
        province: "Zamboanga del Sur"
    },
    {
        city: "Guipos",
        province: "Zamboanga del Sur"
    },
    {
        city: "Josefina",
        province: "Zamboanga del Sur"
    },
    {
        city: "Kumalarang",
        province: "Zamboanga del Sur"
    },
    {
        city: "Labangan",
        province: "Zamboanga del Sur"
    },
    {
        city: "Lakewood",
        province: "Zamboanga del Sur"
    },
    {
        city: "Lapuyan",
        province: "Zamboanga del Sur"
    },
    {
        city: "Mahayag",
        province: "Zamboanga del Sur"
    },
    {
        city: "Margosatubig",
        province: "Zamboanga del Sur"
    },
    {
        city: "Midsalip",
        province: "Zamboanga del Sur"
    },
    {
        city: "Molave",
        province: "Zamboanga del Sur"
    },
    {
        city: "Pagadian",
        province: "Zamboanga del Sur"
    },
    {
        city: "Pitogo",
        province: "Zamboanga del Sur"
    },
    {
        city: "Ramon Magsaysay",
        province: "Zamboanga del Sur"
    },
    {
        city: "San Miguel",
        province: "Zamboanga del Sur"
    },
    {
        city: "San Pablo",
        province: "Zamboanga del Sur"
    },
    {
        city: "Sominot",
        province: "Zamboanga del Sur"
    },
    {
        city: "Tabina",
        province: "Zamboanga del Sur"
    },
    {
        city: "Tambulig",
        province: "Zamboanga del Sur"
    },
    {
        city: "Tigbao",
        province: "Zamboanga del Sur"
    },
    {
        city: "Tukuran",
        province: "Zamboanga del Sur"
    },
    {
        city: "Vincenzo A. Sagun",
        province: "Zamboanga del Sur"
    },
    {
        city: "Zamboanga City",
        province: "Zamboanga del Sur"
    },
    {
        city: "Alicia",
        province: "Zamboanga Sibugay"
    },
    {
        city: "Buug",
        province: "Zamboanga Sibugay"
    },
    {
        city: "Diplahan",
        province: "Zamboanga Sibugay"
    },
    {
        city: "Imelda",
        province: "Zamboanga Sibugay"
    },
    {
        city: "Ipil",
        province: "Zamboanga Sibugay"
    },
    {
        city: "Kabasalan",
        province: "Zamboanga Sibugay"
    },
    {
        city: "Mabuhay",
        province: "Zamboanga Sibugay"
    },
    {
        city: "Malangas",
        province: "Zamboanga Sibugay"
    },
    {
        city: "Naga",
        province: "Zamboanga Sibugay"
    },
    {
        city: "Olutanga",
        province: "Zamboanga Sibugay"
    },
    {
        city: "Payao",
        province: "Zamboanga Sibugay"
    },
    {
        city: "Roseller Lim",
        province: "Zamboanga Sibugay"
    },
    {
        city: "Siay",
        province: "Zamboanga Sibugay"
    },
    {
        city: "Talusan",
        province: "Zamboanga Sibugay"
    },
    {
        city: "Titay",
        province: "Zamboanga Sibugay"
    },
    {
        city: "Tungawan",
        province: "Zamboanga Sibugay"
    }
];
exports.default = Locations;
//# sourceMappingURL=PhilLocations.js.map
const dictionary = {
    "kamusta": { "ilo": "kumusta", "ceb": "kumusta" },
    "mahal": { "ilo": "ay-ayaten", "ceb": "gihigugma" },
    "salamat": { "ilo": "agyamanak", "ceb": "salamat" },
    "oo": { "ilo": "wen", "ceb": "oo" },
    "hindi": { "ilo": "haan", "ceb": "dili" },
    "gutom": { "ilo": "gutom", "ceb": "gutom" },
    "pagkain": { "ilo": "makan", "ceb": "pagkaon" },
    "inom": { "ilo": "inom", "ceb": "inom" },
    "tubig": { "ilo": "danum", "ceb": "tubig" },
    "matulog": { "ilo": "turog", "ceb": "katulog" },
    "trabaho": { "ilo": "ubra", "ceb": "trabaho" },
    "bahay": { "ilo": "balay", "ceb": "balay" },
    "paaralan": { "ilo": "eskuela", "ceb": "eskwelahan" },
    "guro": { "ilo": "mannursuro", "ceb": "maestro" },
    "bata": { "ilo": "ubing", "ceb": "bata" },
    "asawa": { "ilo": "asawa", "ceb": "asawa" },
    "kaibigan": { "ilo": "gayem", "ceb": "higala" },
    "masaya": { "ilo": "naragsak", "ceb": "malipay" },
    "lungkot": { "ilo": "naliday", "ceb": "kasubo" },
    "pag-ibig": { "ilo": "ayat", "ceb": "gugma" },
    "anak": { "ilo": "anak", "ceb": "anak" },
    "araw": { "ilo": "aldaw", "ceb": "adlaw" },
    "gabi": { "ilo": "rabii", "ceb": "gabii" },
    "ulan": { "ilo": "tudo", "ceb": "ulan" },
    "hangin": { "ilo": "angin", "ceb": "hangin" },
    "bundok": { "ilo": "bantay", "ceb": "bukid" },
    "dagat": { "ilo": "daga", "ceb": "dagat" },
    "pamilya": { "ilo": "pamilya", "ceb": "pamilya" },
    "pera": { "ilo": "kwarta", "ceb": "kwarta" },
    "luto": { "ilo": "lutuen", "ceb": "luto" },
    "hinga": { "ilo": "ginawa", "ceb": "ginhawa" },
    "dila": { "ilo": "dila", "ceb": "dila" },
    "mata": { "ilo": "mata", "ceb": "mata" },
    "kamay": { "ilo": "ima", "ceb": "kamot" },
    "paa": { "ilo": "saka", "ceb": "tiil" },
    "bukas": { "ilo": "intono bigat", "ceb": "ugma" },
    "kahapon": { "ilo": "idi kalman", "ceb": "gahapon" },
    "ngayon": { "ilo": "tatta", "ceb": "karun" },
    "kailan": { "ilo": "kano", "ceb": "kanus-a" },
    "saan": { "ilo": "sadino", "ceb": "asa" },
    "bakit": { "ilo": "apay", "ceb": "ngano" },
    "paano": { "ilo": "kasano", "ceb": "unsaon" },
    "bibilhin": { "ilo": "gatangen", "ceb": "paliton" },
    "malayo": { "ilo": "adayu", "ceb": "layo" },
    "malapit": { "ilo": "dikit", "ceb": "duol" },
    "sakit": { "ilo": "agas", "ceb": "sakit" },
    "tulog": { "ilo": "turog", "ceb": "katulog" },
    "alis": { "ilo": "mapan", "ceb": "lakaw" },
    "balik": { "ilo": "agsubli", "ceb": "balik" },
    "pinto": { "ilo": "ruangan", "ceb": "pultahan" },
    "bintana": { "ilo": "bentana", "ceb": "bintana" },
    "silya": { "ilo": "silla", "ceb": "lingkuranan" },
    "mesa": { "ilo": "lamisa", "ceb": "lamisa" },
    "laro": { "ilo": "agawid", "ceb": "dula" },
    "dahon": { "ilo": "bulong", "ceb": "dahon" },
    "bulaklak": { "ilo": "sabong", "ceb": "bulak" },
    "ginto": { "ilo": "buleg", "ceb": "bulawan" },
    "pilak": { "ilo": "salap", "ceb": "salapi" },
    "asul": { "ilo": "buos", "ceb": "asul" },
    "pula": { "ilo": "nalabbaga", "ceb": "pula" }
};

const dictionaryTranslate = (text, fromLang, toLang) => {
    return dictionary[text.toLowerCase()]?.[toLang] || "No dictionary match";
};

const huggingFaceAPI = async (text, fromLang, toLang) => {
    const model = fromLang === "ceb" && toLang === "tl" ? 
        "youdiniplays/ceb-tl-model" : 
        fromLang === "tl" && toLang === "ceb" ? 
        "youdiniplays/tl-ceb-model-v2" : null;

    if (model) {
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
            method: "POST",
            headers: { "Authorization": "Bearer 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" },
            body: JSON.stringify({ inputs: text }),
        });

        const result = await response.json();
        return result[0]?.generated_text || "Translation not available";
    }
    return dictionaryTranslate(text, fromLang, toLang);
};

const translateText = async () => {
    const text = document.getElementById("inputText").value;
    const fromLang = document.getElementById("fromLang").value;
    const toLang = document.getElementById("toLang").value;

    if (!text) return alert("Enter text to translate!");

    const translation = await huggingFaceAPI(text, fromLang, toLang);
    document.getElementById("outputText").value = translation;
};

const startSpeechRecognition = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = document.getElementById("fromLang").value;
    
    recognition.onresult = event => {
        document.getElementById("inputText").value = event.results[0][0].transcript;
    };
    
    recognition.start();
};

const speakText = () => {
    const text = document.getElementById("outputText").value;
    if (!text) return;
    
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
};
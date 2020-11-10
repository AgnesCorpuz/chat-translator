export default {
    translateToEng(text, callback){
        // Sample body ng kailangan itranslate
        let data = {
            raw_text: text,
            source_language: 'auto',
            target_language: 'en'
        }

        fetch('https://i0k1088d5m.execute-api.us-east-1.amazonaws.com/chat-assistant-translate',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
        )
        .then(response => response.json())
        .then(translationData => {
            // Response nung translation
            let translated_text = translationData.translated_text;
            console.log(translated_text);

            callback(translated_text);
        })
        .catch(e => console.error(e));
    },

    translateText(text, language){
        // Sample body ng kailangan itranslate
        let data = {
            raw_text: text,
            source_language: 'auto',
            target_language: language
        }

        fetch('https://i0k1088d5m.execute-api.us-east-1.amazonaws.com/chat-assistant-translate',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
        )
        .then(response => response.json())
        .then(translationData => {
            // Response nung translation
            let translated_text = translationData.translated_text;
            console.log(translated_text);

            return(translated_text);
        })
        .catch(e => console.error(e));
    }
}
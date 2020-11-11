export default {
    translateToEng(text, callback){
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
            console.log(JSON.stringify(translationData));

            callback(translationData);
        })
        .catch(e => console.error(e));
    },

    translateText(text, language, callback){
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
            console.log(JSON.stringify(translationData));

            callback(translationData);
        })
        .catch(e => console.error(e));
    }
}
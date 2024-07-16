import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import React, { useState, useEffect } from 'react';

// import { ElevenLabsClient } from "elevenlabs";
// import { createWriteStream } from "fs";

// import axios from 'axios'

// const text = 'hello this is shubham.'


import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";


function App() {
  // const elevenLabsApiKey = 'sk_4300f1179f78f28a658b5d89ae465626eda95377337a3d0a'

  // const [response, setResponse] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   const options = {
  //     method: 'POST',
  //     headers: {
  //       "Content-Type": "application/json"
        
  //     },
  //     body: "{\"text\":\"Hello this is shubham\",\"model_id\":\"eleven_turbo_v2\"}"
  //   };

  //   fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', options)
  //     .then(response => response.json())
  //     .then(response => {
  //       console.log('response: ', response)
  //       // setResponse(data);
  //       // setLoading(false);
  //     })
  //     .catch(err => {
  //       console.log('error: ', err)
  //     });
  // }, []);


  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;
  // const options = {
  //   method: 'POST',
  //   headers: {'Content-Type': 'application/json'},
  //   body: '{"text":Hello this is shubham,"model_id":"eleven_turbo_v2"}'
  // };
  
  // fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', options)
  //   .then(response => response.json())
  //   .then(response => console.log(response))
  //   .catch(err => console.error(err));

  // const client = new ElevenLabsClient({
  //   apiKey: elevenLabsApiKey,
  // });
  // const text = 'hello this is shubham.'
  // try {
  //   const audio = await client.generate({
  //     voice: "Rachel",
  //     model_id: "eleven_turbo_v2",
  //     text,
  //   });
  //   const fileName = `Rachel.mp3`;
  //   const fileStream = createWriteStream(fileName);

  //   audio.pipe(fileStream);
  //   fileStream.on("finish", () => resolve(fileName)); // Resolve with the fileName
  //   fileStream.on("error", reject);
  // } catch (error) {
  //   reject(error);
  // }
  const [text, setText] = useState('');
  // const [audioUrl, setAudioUrl] = useState('');

  let [audioUrl, setAudioUrl] = useState('');
  let [jsonObjects, setJsonObjects] = useState([]);
  
  const handleChange = (event) => {
    setText(event.target.value);
  };
  const pollyClient = new PollyClient({
    region: 'us-east-1', 
    credentials: {
        accessKeyId: '', 
        secretAccessKey: '', 
        sessionToken: ''
    }
});


  // let jsonObjects = [];
  let audio;
  const handleSubmit = async (event) => {
    event.preventDefault();

    const paramsMp3 = {
        OutputFormat: 'mp3',
        Text: text,
        VoiceId: 'Brian', // You can change to another voice ID,
    };
    const paramsJson = {
        OutputFormat: 'json',
        Text: text,
        VoiceId: 'Brian', // You can change to another voice ID,
        SpeechMarkTypes: ['viseme']
    };
    // jsonObjects.push({time: 0, type: '', value: ''})
    // console.log("object length: ", jsonObjects.length)
    try {
        const commandMp3 = new SynthesizeSpeechCommand(paramsMp3);
        const commandJson = new SynthesizeSpeechCommand(paramsJson);

        // const dataMp3 = await pollyClient.send(commandMp3);
        // const dataJson = await pollyClient.send(commandJson);
        const [dataMp3, dataJson] = await Promise.all([
            pollyClient.send(commandMp3),
            pollyClient.send(commandJson)
          ]);
        // console.log("dataaa: ", data)
        
        const audioBytes = await dataMp3.AudioStream.transformToByteArray();
        const jsonString = await dataJson.AudioStream.transformToString('utf-8');

        // console.log("json: ", typeof jsonString)
        const jsonStrings = jsonString.trim().split('\n');
        jsonObjects = []
        jsonObjects.push({time: 0, type: '', value: ''})
        jsonStrings.forEach(json => {
            const obj = JSON.parse(json);
            jsonObjects.push(obj);
          });

        // console.log(jsonObjects);
        const blob = new Blob([audioBytes], { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(blob);
        // // console.log("URL: ", audioUrl)
        // // saveAs(blob, 'hello.mp3')
        // // setAudioUrl(audioUrl)
        // audio = new Audio(audioUrl);
        // audioUrl = 'audio urllllllllll'
        setAudioUrl(audioUrl)
        // jsonObjects = [1,2,3,4,5,6,7,8,9,10]
        setJsonObjects(jsonObjects)
        console.log("objjjjj: ", jsonObjects)
        console.log("audioooo: ", audioUrl)
    //     return (
    // <>
    //   <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
    //     <color attach="background" args={["#ececec"]} />
    //     <Experience audioUrl={audioUrl} jsonObjects={jsonObjects}/>
    //   </Canvas>
    // </>
  // );
        // audio.play()
    } catch (error) {
        console.error('Error generating audio:', error);
    }
};

// console.log("objjjjj: ", jsonObjects)
// console.log("audioooo: ", audioUrl)

  return (
    <>
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
        <color attach="background" args={["#ececec"]} />
        <Experience audioUrl={audioUrl} jsonObjects={jsonObjects}/>
      </Canvas>
      <div>
          <h1>Text to Audio Conversion</h1>
          <form onSubmit={handleSubmit}>
              <textarea value={text} onChange={handleChange} rows="4" cols="50" />
              <br />
              <button type="submit">Speak</button>
          </form>
      </div>
      
    </>
  );
}

export default App;





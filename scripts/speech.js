//speech connections and functions for AR bot

const speechConfig = SpeechSDK.SpeechConfig.fromSubscription("cc2d2316e8a84c04a6045403ab7d3762", "eastus");
const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig,audioConfig);
const menu = document.getElementById('menu');
const botIcon = document.querySelector('#botIcon');
const screenParent = document.getElementById('screen-parent');
const infoScreen = document.querySelector('#info-screen');
const helpIcon = document.getElementById('help-icon');
const avatarSelectorParent = document.getElementById('avatar-selector-parent');
const avatarSelector = document.getElementById('avatar-selector');
const avatarVoiceSelector = document.getElementById('avatar-voice-parent');
const avatarVoiceList = document.getElementById('avatar-voice'); 
const selectedVoice = document.getElementById('selected-voice'); 
const recordingArea = document.getElementById('recording-area'); 
const responseTextArea = document.getElementById('responseText-area');
const menuOpen = document.getElementById('menu-open');
const settingIcon = document.getElementById('setting-icon');
const menuClose = document.getElementById('menu-close');
const avatarGender = document.getElementById('avatar-gender');
const loading = document.getElementById('loading-icon');
const recBtn = document.querySelector('#recBtn');
const stageToggleSwitchParent = document.querySelector('#stage-toggle-parent');
const stageToggleSwitch = document.querySelector('#stage-toggle');
const recBtn3 = document.getElementById('recording');
const resText = document.getElementById('responseText');
recBtn3.innerHTML = "Recording start";

//fetched from chat.js line 98-115
document.addEventListener('click', () => {
    const silentAudio = new SpeechSDK.SpeakerAudioDestination();
    const silentaudioConfig  = SpeechSDK.AudioConfig.fromSpeakerOutput(silentAudio);
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription("ff542d4a97f340d4ae9faa685afab149", "eastus");
    speechConfig.speechSynthesisVoiceName = 'en-US-JennyNeural'; // or use selectedVoice.innerText
    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, silentaudioConfig);

    // Perform a silent speak to initialize audio context on iOS
    synthesizer.speakTextAsync(
      '',
      result => {
        console.log('Silent speak completed. new');
      },
      error => {
        console.error('Silent speak failed:', error);
      }
    );
});

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Prompt the user to grant microphone access
  navigator.mediaDevices.getUserMedia({ audio: true })
  .then(function(stream) {
      // Microphone access granted, you can now use the stream
      console.log('Microphone access granted');
  })
  .catch(function(error) {
      // Microphone access denied or an error occurred
      console.error('Error accessing microphone:', error);
  });
} else {
  console.error('getUserMedia is not supported by this browser');
}
const recognizeSpeech = () => {
  recognizer.recognizeOnceAsync(result => {
      if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
          console.log(`Recognized: ${result.text}`);   
          resText.innerHTML = `Asked Question: ${result.text}`;  
          recBtn.style.display = 'none';
          const recBtn4 = document.getElementById('waiting');
          const recBtn5 = document.getElementById('Speaking');
          recBtn3.style.display = 'none';
          recBtn4.style.display = 'block';
          recBtn5.style.display = 'none';    
          const botIcon = document.querySelector('#botIcon');
          botIcon.setAttribute('src','')      
          botIcon.style.display = 'none'            
          speech.sendToChatGPT(result.text)            
      } else if (result.reason === SpeechSDK.ResultReason.NoMatch) {
          console.log("No speech recognized. Trying again...");
          recBtn3.innerHTML = "Not Recognized, Try again"
          recognizeSpeech(); // Call the function again if recognition fails
      } else {
          console.error(`Recognition failed: ${result.errorDetails}`);
      }
  });
}

recBtn.addEventListener('click', () => {
  console.log('Recording button clicked!');       
  recBtn3.innerHTML = "Recording start";              
  if(speech.animationState){
      if(speech.animationState !== "idle"){
          speech.playAnimation("idle", null)
      }
      speech.stopSpeaking();    
  }
  botResponseUIReset(); 
  
  const botIcon = document.querySelector('#botIcon');
  botIcon.setAttribute('src','./public/images/Hearing.gif')      
  botIcon.style.display = 'block'   
  
  const recBtn4 = document.getElementById('waiting');
  const recBtn5 = document.getElementById('Speaking');
  recBtn3.style.display = 'inline-block';
  recBtn4.style.display = 'none';
  recBtn5.style.display = 'none';   
  recBtn.style.display = 'none'   
  recognizeSpeech();
});

const botResponseUIReset = () => {
  resText.innerHTML = "";
  if(speechSynthesis){
      speechSynthesis.cancel();
  }      
  const recBtn4 = document.getElementById('waiting');
  const recBtn5 = document.getElementById('Speaking'); 
  const botIcon = document.querySelector('#botIcon'); 
  recBtn3.style.display = 'none';
  recBtn4.style.display = 'none';
  recBtn5.style.display = 'none';     
  botIcon.setAttribute('src','')     
  botIcon.style.display = 'none'       
}

avatarSelector.addEventListener('change', (event) => {        
  const selectedAvatar = event.target.value;           
  if(selectedAvatar != 0){   
      recordingArea.style.display = "none"
      responseTextArea.style.display = "none"        
      botResponseUIReset();
      recBtn3.innerHTML = "Recording start";
      recBtn.style.display = 'inline-block';
      if(speech){
          speech.stopSpeaking();
      } 
      avatarSelector.disabled = true; 
      loading.style.display = "block"   
      while (parentObject.children.length) {
          parentObject.remove(parentObject.children[0]);
      }
      event.preventDefault();            
      app_selected_flag = true  
      disposeOfInactiveAvatar()
      avatarLoader(selectedAvatar)
  }        
});

function sendToChatGPT(voiceInput) {
  console.log("inside");

  // Define the API URL based on the deployment environment
  const apiUrl = 'https://pythonappdrs.azurewebsites.net/chat';
  // const apiUrl = 'https://pytestar.azurewebsites.net/chat'; // Uncomment this if needed

  const headers = {
    'Content-Type': 'application/json',
  };

  // Retrieve and sanitize the persona data from the HTML element
  const personaElement = document.getElementById('persona-text');
  const persona = personaElement ? personaElement.value.replace(/[^a-zA-Z0-9 ,\.]/g, '') : '';

  // Prepare the data to be sent to the API
  const data = {
    user_input: voiceInput,
    system_data: persona,
  };

  // Send the request to the API
  fetch(apiUrl, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(result => {
    // Extract and process the response data
    const chatGPTResponse = result.response;
    const emotion = result.emotion.label;

    // Handle the response (e.g., start speaking and update the UI)
    startSpeaking(chatGPTResponse, emotion);
    const recBtn = document.querySelector('#recBtn');
    if (recBtn) recBtn.style.display = 'inline-block';

  })
  .catch(error => {
    // Handle errors (e.g., update the UI to reflect the error state)
    console.error('Error:', error);

    const recBtn = document.querySelector('#recBtn');
    if (recBtn) recBtn.style.display = 'inline-block';

    const botIcon = document.querySelector('#botIcon');
    const recBtn3 = document.getElementById('recording');
    const recBtn4 = document.getElementById('waiting');
    const recBtn5 = document.getElementById('Speaking');

    if (recBtn3) recBtn3.style.display = 'none';
    if (recBtn4) recBtn4.style.display = 'none';
    if (recBtn5) recBtn5.style.display = 'none';
    if (botIcon) {
      botIcon.setAttribute('src', '');
      botIcon.style.display = 'none';
    }
  });
}

const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

//HTML Fields
const userInputToTestAgentsPTag = document.getElementById("textToTestAgentsInput");
const userSpokenResultPTag = document.getElementById("userSpokenResult");
const systemConfidenceOutputPTag = document.getElementById("systemConfidenceOutput");
const recordVoiceButton = document.getElementById("recordVoiceButton");

function recordVoiceButtonOnClickListener() {
  recordVoiceButton.disabled = true;
  recordVoiceButton.textContent = 'In Progress';

  //Get text from the input field
  const phrase = userInputToTestAgentsPTag.value;
  
  // To ensure case consistency while checking with the returned output text
  phrase = phrase.toLowerCase();
  
  userSpokenResultPTag.textContent = '...loading';
  systemConfidenceOutputPTag.textContent = '...%';

  const grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase +';';
  const recognition = new SpeechRecognition();
  const speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'zh-Yue';
  recognition.interimResults = false;
  recognition.maxAlternatives = 4;

  recognition.start();

  recognition.onresult = function(event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object 
    const speechResult = event.results[0][0].transcript.toLowerCase();
    
    userSpokenResultPTag.textContent = speechResult;
    systemConfidenceOutputPTag.textContent = 'Confidence: ' + (event.results[0][0].confidence * 100).toFixed(2) + '%';
    
    if(speechResult === phrase) {
      userSpokenResultPTag.style.background = 'lime';
    } else {
      userSpokenResultPTag.style.background = 'red';
    }

    console.log('Confidence: ' + event.results[0][0].confidence);
  }

  recognition.onspeechend = function() {
    recognition.stop();
    recordVoiceButton.disabled = false;
    recordVoiceButton.textContent = 'Start new test';
  }

  recognition.onerror = function(event) {
    recordVoiceButton.disabled = false;
    recordVoiceButton.textContent = 'Start new test';
    userSpokenResultPTag.textContent = 'Error occurred in recognition: ' + event.error;
  }
  
  recognition.onaudiostart = function(event) {
      //Fired when the user agent has started to capture audio.
      console.log('SpeechRecognition.onaudiostart');
  }
  
  recognition.onaudioend = function(event) {
      //Fired when the user agent has finished capturing audio.
      console.log('SpeechRecognition.onaudioend');
  }
  
  recognition.onend = function(event) {
      //Fired when the speech recognition service has disconnected.
      console.log('SpeechRecognition.onend');
  }
  
  recognition.onnomatch = function(event) {
      //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
      console.log('SpeechRecognition.onnomatch');
  }
  
  recognition.onsoundstart = function(event) {
      //Fired when any sound — recognisable speech or not — has been detected.
      console.log('SpeechRecognition.onsoundstart');
  }
  
  recognition.onsoundend = function(event) {
      //Fired when any sound — recognisable speech or not — has stopped being detected.
      console.log('SpeechRecognition.onsoundend');
  }
  
  recognition.onspeechstart = function (event) {
      //Fired when sound that is recognised by the speech recognition service as speech has been detected.
      console.log('SpeechRecognition.onspeechstart');
  }
  recognition.onstart = function(event) {
      //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
      console.log('SpeechRecognition.onstart');
  }
};

recordVoiceButton.addEventListener('click', recordVoiceButtonOnClickListener);

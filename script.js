var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

//HTML Fields
var userInputToTestAgentsPTag = document.getElementById(
  'textToTestAgentsInput'
);
var userSpokenResultPTag = document.getElementById('userSpokenResult');
var systemConfidenceOutputPTag = document.getElementById(
  'systemConfidenceOutput'
);
var recordVoiceButton = document.getElementById('recordVoiceButton');
var resultTable = document.getElementById('resultTable');

function recordVoiceButtonOnClickListener() {
  recordVoiceButton.disabled = true;
  recordVoiceButton.textContent = 'In Progress';

  //Get text from the input field
  var phrase = userInputToTestAgentsPTag.value;
  console.log('Phrase: ' + phrase);

  // To ensure case consistency while checking with the returned output text
  phrase = phrase.toLowerCase();

  userSpokenResultPTag.textContent = '...loading';
  systemConfidenceOutputPTag.textContent = '...%';

  var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase + ';';
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'zh-Yue';
  recognition.interimResults = false;
  recognition.maxAlternatives = 4;

  recognition.start();

  recognition.onresult = function (event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object
    const speechResult = event.results[0][0].transcript.toLowerCase();

    //Writing results to screen
    userSpokenResultPTag.innerHTML =
      'What the system think you said: <br><br>' +
      speechResult +
      '<br><br>' +
      convertCharactersToJyutping(speechResult);
    systemConfidenceOutputPTag.textContent =
      'Confidence: ' + (event.results[0][0].confidence * 100).toFixed(2) + '%';

    if (speechResult === phrase) {
      userSpokenResultPTag.style.background = 'lime';
    } else {
      userSpokenResultPTag.style.background = 'red';
    }

    renderResultTable(event.results[0]);
  };

  recognition.onspeechend = function () {
    recognition.stop();
    recordVoiceButton.disabled = false;
    recordVoiceButton.textContent = 'Start new test';
  };

  recognition.onerror = function (event) {
    recordVoiceButton.disabled = false;
    recordVoiceButton.textContent = 'Start new test';
    userSpokenResultPTag.textContent =
      'Error occurred in recognition: ' + event.error;
  };

  recognition.onaudiostart = function (event) {
    //Fired when the user agent has started to capture audio.
    console.log('SpeechRecognition.onaudiostart');
  };

  recognition.onaudioend = function (event) {
    //Fired when the user agent has finished capturing audio.
    console.log('SpeechRecognition.onaudioend');
  };

  recognition.onend = function (event) {
    //Fired when the speech recognition service has disconnected.
    console.log('SpeechRecognition.onend');
  };

  recognition.onnomatch = function (event) {
    //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
    console.log('SpeechRecognition.onnomatch');
  };

  recognition.onsoundstart = function (event) {
    //Fired when any sound — recognisable speech or not — has been detected.
    console.log('SpeechRecognition.onsoundstart');
  };

  recognition.onsoundend = function (event) {
    //Fired when any sound — recognisable speech or not — has stopped being detected.
    console.log('SpeechRecognition.onsoundend');
  };

  recognition.onspeechstart = function (event) {
    //Fired when sound that is recognised by the speech recognition service as speech has been detected.
    console.log('SpeechRecognition.onspeechstart');
  };
  recognition.onstart = function (event) {
    //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
    console.log('SpeechRecognition.onstart');
  };
}

recordVoiceButton.addEventListener('click', recordVoiceButtonOnClickListener);

function convertCharactersToJyutping(characters) {
  return CantoJpMin.toJyutping(characters);
}

function renderResultTable(results) {
  //Clear Table and keep headers
  resultTable.innerHTML = `<tr>
  <th>Characters</th>
  <th>Jyutping</th>
  <th>Confidence of System</th>
</tr>`;

  //add headers back into table

  //add result data to table
  for (let i = 0; i < results.length; i++) {
    //create new row/cells
    let row = document.createElement('tr');
    let cellCharacter = document.createElement('td');
    let cellJyutping = document.createElement('td');
    let cellCofidence = document.createElement('td');

    //Fill cells with information
    cellCharacter.innerHTML = results[i].transcript;
    cellJyutping.innerHTML = convertCharactersToJyutping(results[i].transcript);
    cellCofidence.innerHTML = (results[i].confidence * 100).toFixed(2) + '%';

    //add cells to row
    row.appendChild(cellCharacter);
    row.appendChild(cellJyutping);
    row.appendChild(cellCofidence);

    //add row to table
    resultTable.appendChild(row);
  }
}

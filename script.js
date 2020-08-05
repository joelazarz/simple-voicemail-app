// currently only working on desktop :/

document.addEventListener('DOMContentLoaded', function () {

const client = filestack.init('AWdBfzQSjRIu5xTA3I5xQz')

let blobName = null;
let voiceBlob = null;
let mediaRecorderTop = null;
let t;

let displayTimer = document.querySelector(".display")

const generateName = () => {
  let str = [];
  const arr = ['e','x','r','t','a','w','2','4','6','8','0'];
  for (let i = 0; i < 10; i++) {
    let char = arr[Math.floor(Math.random() * arr.length)];
    str.push(char);
  }
  blobName = str.join('') + '.wav';
};

const recordAudio = () => {
  if (voiceBlob !== null) { voiceBlob = null };

  timeCounter = 15;
  navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    // let outgoingMessage = new Audio('outgoing.wav');
    // outgoingMessage.play(); // plays outgoing message

    setTimeout(() => { // 4 second delay, waits for outgoing message to play
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderTop = mediaRecorder; // for stop control
      mediaRecorder.start();

      const recordedChunks = [];
      mediaRecorder.addEventListener("dataavailable", e => {
        recordedChunks.push(e.data);
      });

      t = setInterval(function() { // timer 
        timeCounter--;
        if(timeCounter >= 10) {
          displayTimer.innerText = `00:${timeCounter}`
        } else {
          displayTimer.innerText = `00:0${timeCounter}`
        }
        console.log(timeCounter);
      }, 1000);

      // creates blob of recorded audio data once recording has stopped
      mediaRecorder.addEventListener("stop", () => {
        clearInterval(t);
        generateName();
        const mime = ['audio/wav', 'audio/mpeg', 'audio/webm', 'audio/ogg']
        .filter(MediaRecorder.isTypeSupported)[0];
        const audioBlob = new Blob(recordedChunks, {type: mime});
        voiceBlob = audioBlob;
      });

      setTimeout(() => { // stops recording after 15 seconds
        if (mediaRecorder.state === 'inactive') { return };
        mediaRecorder.stop();
      }, 15000);

    }, 4000); // end of timeout for outgoing message

  });
};

const stopRecorder = () => {
  if (mediaRecorderTop === null || mediaRecorderTop.state === 'inactive') { return };
  mediaRecorderTop.stop();
};

const playBlob = () => {
  if (voiceBlob === null) { return };

  const audioUrl = URL.createObjectURL(voiceBlob);
  const audio = new Audio(audioUrl);
  audio.play();
};

const deleteBlob = () => {
  blobName = null;
  voiceBlob = null;
  mediaRecorderTop = null;
  timeCounter = 15;
};

const logBlob = () => { 
  console.log(voiceBlob); 
  console.log(blobName);
};

const saveBlob = () => {
  if (voiceBlob === null) { return };

  client.upload(voiceBlob, { filename: blobName }) // add filename
  .then(res => {
    console.log(res);
    // set voiceBlob blobName mediaRecorderTop back to null
    deleteBlob();
  });
};

const recordButton = document.querySelector(".record-button")
recordButton.addEventListener("click", recordAudio);

const stopButton = document.querySelector(".stop")
stopButton.addEventListener("click", logBlob);

const playButton = document.querySelector(".play")
playButton.addEventListener("click", playBlob);

const deleteButton = document.querySelector(".play")
deleteButton.addEventListener("click", deleteBlob);

});
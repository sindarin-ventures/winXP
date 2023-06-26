let personaClient;

export async function init() {
  var script = document.createElement('script');
  script.src = 'https://app.sindarin.tech/PersonaClientPublic?apikey=abc';

  script.addEventListener('load', async () => {
    const apiKey = 'abc';
    personaClient = new window.PersonaClient(apiKey);
  });
  document.head.appendChild(script);
}

export async function startPersona() {
  const character = 'SmarterChild';
  await personaClient.init(character);
  console.log('personaClient initialized');

  // personaClient.updateState(JSON.parse({}));
  // personaClient.sendUserText('');
  personaClient.on('ready', () => {
    console.log('persona client ready');
    personaClient.sayText(`Hey! That tickles!`);
  });
  personaClient.on('user_speech_started', () => {});
  personaClient.on('ai_speech_started', () => {});
  personaClient.on('connect_error', error => {});
  personaClient.on('disconnected', () => {});
  personaClient.on('json', ({ detail }) => {
    if (detail.transcription) {
      return;
    }
  });
}

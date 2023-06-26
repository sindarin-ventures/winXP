export async function init() {
  var script = document.createElement('script');
  script.src = 'https://app.sindarin.tech/PersonaClient?apikey=abc';
  // Optionally, you can add an event listener for the load event if you want to do something once the script is loaded:
  script.addEventListener('load', async () => {
    console.log('Script loaded!');
    console.log('script', script);
    console.log('window', window);

    const apiKey = '';
    const personaClient = new window.PersonaClient(apiKey);

    const character = 'SmarterChild';
    await personaClient.init(character);

    personaClient.updateState(JSON.parse({}));
    personaClient.sendUserText('');
    personaClient.on('ready', () => {
      console.log('persona client ready');
    });
    personaClient.sayText(`Hey! That tickles!`);
    personaClient.on('user_speech_started', () => {});
    personaClient.on('ai_speech_started', () => {});
    personaClient.on('connect_error', error => {});
    personaClient.on('disconnected', () => {});
    personaClient.on('json', ({ detail }) => {
      if (detail.transcription) {
        return;
      }
    });
  });
  // Append the script tag to the head (or any other element):
  document.head.appendChild(script);
}

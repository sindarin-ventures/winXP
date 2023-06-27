import React, { useEffect, useState } from 'react';

const PersonaClient = props => {
  const [personaClient, setPersonaClient] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [didSetListeners, setDidSetListeners] = useState(false);

  useEffect(() => {
    console.log('loading persona client');
    const script = document.createElement('script');
    script.src = 'https://app.sindarin.tech/PersonaClientPublic?apikey=abc';

    script.addEventListener('load', async () => {
      console.log('persona client loaded');
      const apiKey = 'abc';
      const personaClient = new window.PersonaClient(apiKey);
      setPersonaClient(personaClient);
    });
    document.head.appendChild(script);
  }, []);

  // Use handlers here
  useEffect(() => {
    if (personaClient && isReady && !didSetListeners) {
      personaClient.on('user_speech_started', () => {});
      personaClient.on('ai_speech_started', () => {});
      personaClient.on('connect_error', error => {});
      personaClient.on('disconnected', () => {});
      personaClient.on('json', ({ detail }) => {
        console.log('json', detail);
        if (detail.transcription) {
          return;
        }

        if (detail.pick_cheeky_action) {
          if (detail.pick_cheeky_action === 'show_blue_screen_of_death') {
            props.onGame();
          } else if (detail.pick_cheeky_action === 'play_chumbawumba_song') {
            props.onWarn();
          } else if (detail.pick_cheeky_action === 'play_viral_video') {
            props.onExpression();
          }
        }
      });

      setDidSetListeners(true);
    }
  }, [
    personaClient,
    props.onGame,
    props.onWarn,
    props.onExpression,
    isReady,
    didSetListeners,
  ]);

  // startPersona function
  useEffect(() => {
    if (personaClient && props.shouldStartPersona) {
      console.log('starting persona client');
      const character = 'SmarterChild';
      personaClient.init(character).then(() => {
        console.log('personaClient initialized');
        personaClient.on('ready', () => {
          personaClient.sayText(`Hah hey! That tickles!!!`);
          setIsReady(true);
        });
      });
    }
  }, [personaClient, props.shouldStartPersona]);

  return null; // or return UI elements if needed
};

export default PersonaClient;

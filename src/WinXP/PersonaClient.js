/* eslint-disable prettier/prettier */
import { current } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';

let latestEvent = null;
let currentState = 'Idle';
let desiredState = 'Idle';
let transitioning = false;  // Added this new flag
let stateTransitionChain = ['Idle', 'Listening', 'Thinking', 'Speaking', 'SuccessfulResponse'];

const PersonaClient = props => {
  const [personaClient, setPersonaClient] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [didSetListeners, setDidSetListeners] = useState(false);

  useEffect(() => {
    console.log('loading persona client');
    const script = document.createElement('script');
    script.src = 'https://app.sindarin.tech/PersonaClientPublic?apikey=d44486bf-78e4-47b1-aaa0-bbd05ee495a1';

    script.addEventListener('load', async () => {
      console.log('persona client loaded');
      const apiKey = 'd44486bf-78e4-47b1-aaa0-bbd05ee495a1';
      const personaClient = new window.PersonaClient(apiKey);
      setPersonaClient(personaClient);
    });
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const gotoFinalState = async () => {
      console.log('gotoFinalState', latestEvent)
      console.log('currentState', currentState)
      if (!latestEvent) {
        return;
      }
      
      if (latestEvent === currentState) {
        return;
      }

      while (latestEvent !== currentState) {
        const nextIdx = stateTransitionChain.indexOf(currentState) + 1 > stateTransitionChain.length ? 0 : stateTransitionChain.indexOf(currentState) + 1;
        const nextStateName = stateTransitionChain[nextIdx];
        console.log('nextStateName', nextStateName)
        props.stateMachineControls[`transitionTo${nextStateName}`]();
        await new Promise(resolve => setTimeout(resolve, 1000));
        currentState = nextStateName;
      }


    };

    const handleEvent = (newState) => {
      latestEvent = newState;
      gotoFinalState();
    }
    
    
    

    if (personaClient && isReady && !didSetListeners) {
      personaClient.on('user_speech_started', () => {
        // console.log('user_speech_started')
        // handleEvent('Listening');
      });

      personaClient.on('user_speech_ended', () => {
        // console.log('user_speech_ended')
        // handleEvent('Thinking');
      });

      personaClient.on('ai_speech_started', () => {
        // console.log('ai_speech_started')
        // handleEvent('Speaking');
      });

      personaClient.on('ai_speech_stopped', () => {
        // console.log('ai_speech_stopped')
        // handleEvent('Idle');
      });

      personaClient.on('connect_error', error => {});
      personaClient.on('disconnected', () => {});
      personaClient.on('json', ({ detail }) => {
        if (detail.transcription) {
          return;
        }
        // console.log('json', detail);

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
          personaClient.sayText(`Hey! Can you hear me?!`);
          setIsReady(true);
        });
      });
    }
  }, [personaClient, props.shouldStartPersona]);

  return null; // or return UI elements if needed
};

export default PersonaClient;

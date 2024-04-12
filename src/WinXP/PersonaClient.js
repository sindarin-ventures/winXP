/* eslint-disable prettier/prettier */
import { current } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

let latestEvent = null;
let currentState = 'Idle';
let desiredState = 'Idle';
let transitioning = false;  // Added this new flag
let stateTransitionChain = ['Idle', 'Listening', 'Thinking', 'Speaking', 'SuccessfulResponse'];

const PersonaClient = props => {
  const [personaClient, setPersonaClient] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [didSetListeners, setDidSetListeners] = useState(false);
  const [didStartPersona, setDidStartPersona] = useState(false);

  useEffect(() => {
    console.log('loading persona client');
    const script = document.createElement('script');
    // script.src = 'https://api.sindarin.tech/PersonaClientPublic?apikey=5b348906-a885-4cfb-9cba-b9eca4ff06bf';
    script.src = 'https://api.prod.centralus.az.sindarin.tech/PersonaClientPublic?apikey=5b348906-a885-4cfb-9cba-b9eca4ff06bf';

    // script.src = 'http://localhost:3004/PersonaClientPublic?apikey=5b348906-a885-4cfb-9cba-b9eca4ff06bf';

    script.addEventListener('load', async () => {
      console.log('persona client loaded');
      const apiKey = '5b348906-a885-4cfb-9cba-b9eca4ff06bf';
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
      personaClient.on('action', ({ detail }) => {

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

        if (detail.message_limit_reached) {
          props.onLimitReached();
        }
      });

      setDidSetListeners(true);
    }
  }, [
    personaClient,
    props.onGame,
    props.onWarn,
    props.onExpression,
    props.onLimitReached,
    isReady,
    didSetListeners,
  ]);

  // startPersona function
  useEffect(() => {
    const getUserID = async () => {
      try {
        const res = await axios.get('https://geolocation-db.com/json/');
  
        const userId = res.data.IPv4;
        return userId.replace(/\./g, '_');
      } catch (e) {
        // use localstorage instead
        const userId = localStorage.getItem('scuid');
        if (userId) {
          return userId;
        } else {
          const userId = uuid();
          localStorage.setItem('scuid', userId);
          return userId;
        }
      }
    };

    if (personaClient && props.shouldStartPersona && !didStartPersona) {
      setDidStartPersona(true);
      console.log('starting persona client');
      const character = 'SmarterChild';

      getUserID().then(userId => {
        personaClient.init({userId, personaName: character}).then(() => {
          console.log('personaClient initialized');
          personaClient.on('ready', () => {
            props.onReady();
            setIsReady(true);
          });
        }).catch(err => {
          console.log('personaClient init error', err);
          if (/You have/ig.test(err)) {
            props.onLimitReached();
          }
        });
      });
    }
  }, [personaClient, props.shouldStartPersona, props.onReady, didStartPersona, props.onLimitReached]);

  return null; // or return UI elements if needed
};

export default PersonaClient;

/* eslint-disable prettier/prettier */
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import { useState, useEffect, useCallback } from 'react';

export function useRiveStateMachine({ src, stateMachineName, autoplay = true }) {
  const { rive, RiveComponent } = useRive({
    src,
    stateMachines: stateMachineName,
    autoplay,
  });

  // Define your state machine inputs here
  const listeningInput = useStateMachineInput(rive, stateMachineName, 'Listening');
  const thinkingInput = useStateMachineInput(rive, stateMachineName, 'Thinking');
  const speakingInput = useStateMachineInput(rive, stateMachineName, 'Speaking');
  const successfulResponseInput = useStateMachineInput(rive, stateMachineName, 'Response / successful');
  const failResponseInput = useStateMachineInput(rive, stateMachineName, 'Response / fail');
  const idleInput = useStateMachineInput(rive, stateMachineName, 'Idle');

  // Define your transition functions here, and wrap them with useCallback to ensure they are stable between renders
  const transitionToListening = useCallback(() => listeningInput?.fire(), [listeningInput]);
  const transitionToThinking = useCallback(() => thinkingInput?.fire(), [thinkingInput]);
  const transitionToSpeaking = useCallback(() => speakingInput?.fire(), [speakingInput]);
  const transitionToSuccessfulResponse = useCallback(() => successfulResponseInput?.fire(), [successfulResponseInput]);
  const transitionToFailResponse = useCallback(() => failResponseInput?.fire(), [failResponseInput]);
  const transitionToIdle = useCallback(() => idleInput?.fire(), [idleInput]);

  return {
    rive,
    RiveComponent,
    transitionToListening,
    transitionToThinking,
    transitionToSpeaking,
    transitionToSuccessfulResponse,
    transitionToFailResponse,
    transitionToIdle,
  };
}

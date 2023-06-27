/* eslint-disable prettier/prettier */
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';

export const useRiveStateMachine = ({ src, stateMachineName, autoplay }) => {
  const { rive, RiveComponent } = useRive({
    src,
    stateMachines: stateMachineName,
    autoplay,
  });

  const listeningInput = useStateMachineInput(rive, stateMachineName, 'Listening');
  const idleInput = useStateMachineInput(rive, stateMachineName, 'Idle');
  const thinkingInput = useStateMachineInput(rive, stateMachineName, 'Thinking');
  const speakingInput = useStateMachineInput(rive, stateMachineName, 'Speaking');
  const successfulResponseInput = useStateMachineInput(rive, stateMachineName, 'Response / successful');
  const failResponseInput = useStateMachineInput(rive, stateMachineName, 'Response / fail');

  const transitionToListening = () => {
    if (listeningInput) {
      listeningInput.fire();
    }
  };

  const transitionToThinking = () => {
    if (thinkingInput) {
      thinkingInput.fire();
    }
  };

  const transitionToSpeaking = () => {
    if (speakingInput) {
      speakingInput.fire();
    }
  };

  const transitionToSuccessfulResponse = () => {
    if (successfulResponseInput) {
      successfulResponseInput.fire();
    }
  };

  const transitionToFailResponse = () => {
    if (failResponseInput) {
      failResponseInput.fire();
    }
  };

  const transitionToIdle = () => {
    if (idleInput) {
      idleInput.fire();
    }
  };
  // Add more transition functions as needed...

  return { RiveComponent, transitionToListening, transitionToThinking, transitionToSpeaking, transitionToSuccessfulResponse, transitionToFailResponse, transitionToIdle };
};
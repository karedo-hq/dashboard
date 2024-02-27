import { Button } from '@/components/ui/button';
import { Stepper, StepperFooter, StepperItem, useStepper } from '@/components/ui/stepper';
import React from 'react';

const steps = [
  { id: 0, label: 'Persönliche Informationen' },
  { id: 1, label: 'Gerichtliche Angaben' },
  { id: 2, label: 'Angaben zur Betreuung' },
];

export default function CreateClientStepper({
  stepsContent,
  submitButton,
}: {
  stepsContent: React.ReactNode[];
  submitButton: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-4">
      <Stepper initialStep={0} steps={steps}>
        {steps.map((step, index) => {
          return <StepperItem key={step.id}>{stepsContent[index]}</StepperItem>;
        })}
        <StepperFooter>
          <CreateClientStepperFooter submitButton={submitButton} />
        </StepperFooter>
      </Stepper>
    </div>
  );
}

function CreateClientStepperFooter({ submitButton }: { submitButton: React.ReactNode }) {
  const {
    activeStep,
    isLastStep,
    isOptionalStep,
    isDisabledStep,
    nextStep,
    prevStep,
    resetSteps,
    steps,
  } = useStepper();

  const handleNextStep = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    nextStep();
  };

  const handlePrevStep = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    prevStep();
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {activeStep === steps.length ? (
        <Button onClick={resetSteps}>Reset</Button>
      ) : (
        <>
          <Button disabled={isDisabledStep} onClick={handlePrevStep}>
            Prev
          </Button>

          {isLastStep ? (
            submitButton
          ) : (
            <Button onClick={handleNextStep}>{isOptionalStep ? 'Skip' : 'Next'}</Button>
          )}
        </>
      )}
    </div>
  );
}

"use client";

import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperSeparator,
  StepperTitle,
} from "@/components/ui/Stepper";

type Step = {
  key: string;
  title: string;
  description: string;
};

export function LandingStepsList({
  steps,
  activeKey,
}: {
  steps: Step[];
  activeKey: string;
}) {
  return (
    <Stepper
      orientation="vertical"
      nonInteractive
      defaultValue={activeKey}
      className="w-full"
    >
      <StepperList className="w-full gap-0">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const completed = index < steps.length - 1;

          return (
            <StepperItem
              key={step.key}
              value={step.key}
              completed={completed}
              className="!w-full !flex-none !flex-row items-stretch gap-1"
            >
              <div className="flex flex-col items-center">
                <StepperIndicator className="text-xs" />
                {!isLast ? (
                  <StepperSeparator
                    forceMount
                    className="min-h-3 flex-1 data-[orientation=vertical]:h-auto"
                  />
                ) : null}
              </div>
              <div className="flex flex-col gap-0.5 pb-2">
                <StepperTitle className="h6 tracking-tight">
                  {step.title}
                </StepperTitle>
                <StepperDescription className="max-w-[36ch] text-balance">
                  {step.description}
                </StepperDescription>
              </div>
            </StepperItem>
          );
        })}
      </StepperList>
    </Stepper>
  );
}

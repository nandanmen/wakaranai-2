import * as TooltipBase from "@radix-ui/react-tooltip";
import React, { type ReactNode } from "react";

export const Tooltip = ({
  content,
  children,
}: {
  content: ReactNode;
  children: ReactNode;
}) => {
  return (
    <TooltipBase.Provider delayDuration={0} skipDelayDuration={0}>
      <TooltipBase.Root>
        <TooltipBase.Trigger asChild>{children}</TooltipBase.Trigger>
        <TooltipBase.Portal>
          <TooltipBase.Content
            side="bottom"
            className="select-none border border-neutral-500 bg-white"
            style={{
              boxShadow: "3px 3px 0 rgba(0,0,0,.15)",
            }}
          >
            {content}
            <TooltipBase.Arrow className="fill-white stroke-neutral-500 -translate-y-px" />
          </TooltipBase.Content>
        </TooltipBase.Portal>
      </TooltipBase.Root>
    </TooltipBase.Provider>
  );
};

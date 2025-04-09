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
            className="select-none rounded-[4px] bg-sand-12 text-sand-1 px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
            sideOffset={5}
          >
            {content}
            <TooltipBase.Arrow className="fill-sand-12" />
          </TooltipBase.Content>
        </TooltipBase.Portal>
      </TooltipBase.Root>
    </TooltipBase.Provider>
  );
};

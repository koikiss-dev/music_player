import { FC, memo } from "react";
import { Button } from "./ui/button";
import {
  RiPauseFill,
  RiPlayFill,
  RiSkipLeftFill,
  RiSkipRightFill,
} from "@remixicon/react";
import { cn } from "@/lib/utils";

interface ControlsProps {
  dominantColor: string;
  isPlaying: boolean;
  play: () => void;
  changeSong: (direction: "left" | "right") => void;
}

const Controls: FC<ControlsProps> = memo(
  ({ dominantColor, isPlaying, play, changeSong }) => {
    return (
      <div className="flex justify-center">
        <div className="flex justify-between items-center grow-0 shrink basis-64">
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => changeSong("left")}
            className="[&_svg]:size-6 rounded-full text-neutral-600 h-10 w-10"
          >
            <RiSkipLeftFill />
          </Button>
          <Button
            size={"icon"}
            style={{ backgroundColor: dominantColor, color: "#fff" }}
            className={cn(`rounded-full h-10 w-10 [&_svg]:size-6  `)}
            onClick={() => play()}
          >
            {isPlaying ? <RiPauseFill /> : <RiPlayFill />}
          </Button>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => changeSong("right")}
            className="[&_svg]:size-6 h-10 w-10 rounded-full text-neutral-600"
          >
            <RiSkipRightFill />
          </Button>
        </div>
      </div>
    );
  }
);

export default Controls;

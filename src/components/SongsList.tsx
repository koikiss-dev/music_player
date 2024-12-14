import { ComponentPropsWithoutRef, FC, memo, useId } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

export type Song = {
  id: number;
  title: string;
  artist: string;
  image: string;
  src: string;
};

export interface SongsInterface {
  songs: Song[];
}
interface SongsListProps extends ComponentPropsWithoutRef<"ul"> {
  songsList: Song[];
  SelectAndPlaySong?: (id: number) => void;
  setIsDrawerOpen?: (value: boolean) => void;
  currentSongId?: number | null;
}

export const SongsList: FC<SongsListProps> = memo(
  ({
    className,

    songsList = [],
    SelectAndPlaySong = () => {},
    setIsDrawerOpen = () => {},
    currentSongId,
  }) => {
    return (
      <ScrollArea className={cn("w-full h-[400px]", className)}>
        <ul className={cn("px-4 divide-y flex flex-col ", className)}>
          {songsList.map((v, _i) => {
            return (
              <li
                data-current={currentSongId === v.id}
                className="p-4 flex items-center gap-4 cursor-pointer bg-transparent hover:bg-muted data-[current=true]:bg-muted"
                key={useId()}
                onClick={() => {
                  SelectAndPlaySong(v.id);
                  setIsDrawerOpen(false);
                }}
              >
                <img
                  className="aspect-square rounded-sm"
                  src={v.image}
                  alt={v.title}
                  width={"40"}
                  height={"40"}
                />
                <div>
                  <div className="font-medium text-sm">{v.title}</div>
                  <span className="text-muted-foreground text-xs">
                    {v.artist}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    );
  }
);

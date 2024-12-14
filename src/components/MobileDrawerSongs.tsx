import { RiArchiveStackFill } from "@remixicon/react";
import { FC, memo } from "react";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "./ui/drawer";
import { Song, SongsList } from "./SongsList";

interface MobileDrawerSongsProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentSongId: number | null;
  songs: Song[];
  SelectAndPlaySong: (id: number) => void;
}

const MobileDrawerSongs: FC<MobileDrawerSongsProps> = memo(
  ({
    isDrawerOpen,
    setIsDrawerOpen,
    currentSongId,
    songs,
    SelectAndPlaySong,
  }) => {
    return (
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button
            variant={"ghost"}
            className="[&_svg]:size-6 right-5 bottom-5 fixed h-10 w-10 lg:hidden"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          >
            <RiArchiveStackFill />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Playing from the library</DrawerTitle>
            <DrawerDescription> Select a song </DrawerDescription>
          </DrawerHeader>
          <SongsList
            currentSongId={currentSongId}
            songsList={songs}
            SelectAndPlaySong={SelectAndPlaySong}
            setIsDrawerOpen={setIsDrawerOpen}
            className="flex "
          />
        </DrawerContent>
      </Drawer>
    );
  }
);

export default MobileDrawerSongs;

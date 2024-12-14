import { Howl } from "howler";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Slider } from "@/components/ui/slider";

import ColorThief from "colorthief";

import MobileDrawerSongs from "./components/MobileDrawerSongs";
import { SongsList } from "./components/SongsList";
import Controls from "./components/Controls";

type Song = {
  id: number;
  title: string;
  artist: string;
  image: string;
  src: string;
};

interface SongsInterface {
  songs: Song[];
}

function App() {
  const [currentSongId, setCurrentSongId] = useState<number | null>(1);
  const [currentGeneralData, setCurrentGeneralData] = useState<Song>(
    {} as Song
  );

  const [isPlaying, setPlaying] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [current, setCurrentTime] = useState<number>(0);
  const [dominantColor, setDominantColor] = useState<string>("");
  const player = useRef<Howl | null>(null);
  const colorthief = useRef<ColorThief | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const songs: SongsInterface["songs"] = [
    {
      id: 1,
      title: "Baby Said",
      artist: "Måneskin",
      image: "https://i.scdn.co/image/ab67616d00001e02c1b211b5fcdef31be5f806df",
      src: "./BabySaid.mp3",
    },
    {
      id: 2,
      title: "Ty Zhe Ne Znaesh Kto Ya",
      artist: "Molchat Doma",
      image: "https://i.scdn.co/image/ab67616d00001e027ee333ca98787ba1c7f5b4e4",
      src: "./Ty Zhe Ne Znaesh Kto Ya.mp3",
    },
    {
      id: 3,
      title: "Big Dawgs",
      artist: "Hanumankind",
      image: "https://i.scdn.co/image/ab67616d00001e02d9afe5c70c43cb2bd34605ea",
      src: "./Big Dawgs.opus",
    },
    {
      id: 4,
      title: "Eyes Closed",
      artist: "Imagine Dragons",
      image: "https://i.scdn.co/image/ab67616d00001e027eeb115b73e2e6abc3c66d59",
      src: "./Imagine Dragons - Eyes Closed.opus",
    },
    {
      id: 5,
      title: "Bastille",
      artist: "Pompeii",
      image: "https://i.scdn.co/image/ab67616d00001e02b89cf022db28fa31376e0ed8",
      src: "./Bastille - Pompeii.mp3",
    },
  ];

  const HOWLER_CONFIG = {
    html5: true,
    onload: () => {
      setTotalDuration(player.current?.duration() || 0);
    },
    onplay: () => {
      setPlaying(true);
    },
    onpause: () => {
      setPlaying(false);
    },
    onend: () => {
      setPlaying(false);
      setCurrentTime(0);
    },
  };

  //function to manage play and pause event in general
  function play() {
    const IS_PLAYING = player.current?.playing();
    IS_PLAYING ? player.current?.pause() : player.current?.play();
  }

  const handleChangePositionMusicSlider = (value: number) => {
    if (player.current) {
      setCurrentTime(value);
    }
  };

  const handleStartSlide = () => {
    //setIsSliding(true);
    isPlaying && play();
    player.current?.pause();
  };

  const handleEndSlide = () => {
    //setIsSliding(false);
    player.current?.seek(current); // Cambia a la nueva posición
    play();
  };

  /**
   * Función que calcula el tiempo en formato mm:ss
   * @param {number} time - Tiempo en segundos
   * @returns {string} Tiempo en formato mm:ss
   */
  const calcTime = useCallback((time: number): string => {
    const roundedSeconds = Math.round(time); // Redondeamos los segundos al entero más cercano
    const minutes = Math.floor(roundedSeconds / 60);
    const remainingSeconds = roundedSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }, []);

  const totalTime = useMemo(() => calcTime(totalDuration), [totalDuration]);

  const currentTime = useMemo(() => calcTime(current), [current]);

  /**
   * Selects a song and plays it
   * @param {number} id - The id of the song to play
   */
  const SelectAndPlaySong = useCallback(
    (id: number) => {
      const songId = songs.find((s) => s.id === id);

      if (!songId) return;

      if (player.current) {
        player.current.stop();
      }

      player.current = new Howl({
        src: [songId.src],
        ...HOWLER_CONFIG,
      });

      player.current.play();
      setCurrentSongId(id);
      setCurrentGeneralData(songId);
    },
    [songs]
  );

  const changeSong = useCallback(
    (direction: "left" | "right") => {
      if (!currentSongId) {
        return;
      }
      if (songs[songs.length - 1]?.id === currentSongId) SelectAndPlaySong(1);

      if (direction === "left" && currentSongId === 1) SelectAndPlaySong(1);

      const newId =
        direction === "left" ? currentSongId - 1 : currentSongId + 1;
      SelectAndPlaySong(newId);
    },
    [currentSongId]
  );

  const updatePosition = (
    updateNumber: number,
    direction: "left" | "right"
  ) => {
    const condition =
      direction === "left"
        ? Math.max(0, current - updateNumber) // si current - updateNumber es menor a 0, devuelve 0, asi se evita que el tiempo sea negativo
        : current + updateNumber;
    setCurrentTime(condition);
    player.current?.seek(condition);
  };
  //init howler
  useEffect(() => {
    player.current = new Howl({
      src: [songs[0].src],

      ...HOWLER_CONFIG,
    });

    colorthief.current = new ColorThief();

    return () => {
      player.current?.unload();
      colorthief.current = null;
    };
  }, []);

  useEffect(() => {
    // Actualizar el tiempo actual periódicamente
    const interval = setInterval(() => {
      if (player.current?.playing()) {
        setCurrentTime(player.current.seek());
      }
    }, 100);

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar
  }, [currentTime]);

  useEffect(() => {
    const song = songs.find((s) => s.id === currentSongId);
    song && setCurrentGeneralData(song);
  }, []);

  useEffect(() => {
    if ("mediaSession" in navigator) {
      const { mediaSession } = navigator;

      mediaSession.metadata = new MediaMetadata({
        title: currentGeneralData.title,
        artist: currentGeneralData.artist,
        artwork: [
          {
            src:
              currentGeneralData.image ||
              "https://i.scdn.co/image/ab67616d00001e02c1b211b5fcdef31be5f806df",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      });

      mediaSession.setActionHandler("play", () => {
        player.current?.play();
      });

      mediaSession.setActionHandler("pause", () => {
        player.current?.pause();
      });

      mediaSession.setActionHandler("previoustrack", () => {
        changeSong("left");
      });

      mediaSession.setActionHandler("nexttrack", () => {
        changeSong("right");
      });
    }
    return () => {
      // Limpiar handlers al desmontar o al cambiar la pista
      if ("mediaSession" in navigator) {
        const { mediaSession } = navigator;
        mediaSession.setActionHandler("play", null);
        mediaSession.setActionHandler("pause", null);
        mediaSession.setActionHandler("previoustrack", null);
        mediaSession.setActionHandler("nexttrack", null);
      }
    };
  }, [currentGeneralData, currentSongId]);

  useEffect(() => {
    player.current?.on("end", () => {
      changeSong("right");
    });

    return () => {
      player.current?.off("end", () => {
        changeSong("right");
      });
    };
  }, [currentSongId]);

  useEffect(() => {
    if (!currentGeneralData.image) return;
    if (!imageRef.current) return;
    const img = new Image(500, 500);
    img.src = imageRef.current.src;
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      const color = colorthief.current?.getColor(img);
      if (color) {
        const hex = color.map((x) => x.toString(16).padStart(2, "0")).join("");
        setDominantColor(`#${hex}`);
      }
    };

    img.onerror = () => {
      console.error("Failed to load image");
    };
  }, [currentGeneralData.image]);

  useEffect(() => {
    function handleSpaceControlMusic(e: KeyboardEvent) {
      if (e.key === " ") {
        e.preventDefault();
        play();
      }
    }
    document.addEventListener("keydown", handleSpaceControlMusic);
    return () => {
      document.removeEventListener("keydown", handleSpaceControlMusic);
    };
  });

  useEffect(() => {
    function handleChangePositionMusicWithArrows(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        updatePosition(5, "left");
        //play();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        updatePosition(5, "right");
        //play();
      }
    }
    document.addEventListener("keydown", handleChangePositionMusicWithArrows);
    return () => {
      document.removeEventListener(
        "keydown",
        handleChangePositionMusicWithArrows
      );
    };
  });

  return (
    <main className="flex flex-col h-dvh relative">
      <div className="flex h-screen justify-center items-center">
        <div className="flex flex-col gap-8 w-[85vw]">
          <div className=" lg:flex lg:gap-10 lg:justify-center ">
            <figure className="flex justify-center lg:justify-start lg:grow-0 lg:shrink lg:basis-[400px] relative">
              <img
                ref={imageRef}
                className="aspect-square object-cover rounded-xl min-h-36 w-full h-full sm:max-w-[400px] sm:max-h-[400px]"
                src={currentGeneralData.image}
                alt="cover"
                width={"auto"}
                height={"auto"}
              />
            </figure>
            <SongsList
              currentSongId={currentSongId}
              songsList={songs}
              SelectAndPlaySong={SelectAndPlaySong}
              setIsDrawerOpen={setIsDrawerOpen}
              className="hidden lg:flex flex-1 lg:grow-0 lg:shrink lg:basis-[500px]"
            />
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="font-bold lg:text-3xl">
                  {currentGeneralData.title}{" "}
                </span>
                <span className="text-sm text-neutral-700">
                  {currentGeneralData.artist}{" "}
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex text-neutral-600 text-xs items-center justify-between">
                  <span>{currentTime} </span>
                  <span>{totalTime} </span>
                </div>

                <Slider
                  className="w-full"
                  style={
                    {
                      "--tw-range-bg": dominantColor,
                    } as React.CSSProperties
                  }
                  onValueChange={(e) => handleChangePositionMusicSlider(e[0])}
                  onPointerDown={handleStartSlide}
                  onPointerUp={handleEndSlide}
                  defaultValue={[0]}
                  value={[Number(current)]}
                  min={0}
                  max={Number(player.current?.duration())}
                  step={0.1}
                />
              </div>
            </div>
            {/* control */}
            <Controls
              dominantColor={dominantColor}
              isPlaying={isPlaying}
              play={play}
              changeSong={changeSong}
            />
          </div>
        </div>
      </div>

      <MobileDrawerSongs
        currentSongId={currentSongId}
        songs={songs}
        SelectAndPlaySong={SelectAndPlaySong}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      ></MobileDrawerSongs>
    </main>
  );
}

export default App;

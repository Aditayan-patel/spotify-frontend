import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";

const server = "https://spotify-aditayan.duckdns.org";

export interface Song {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  audio: string;
  album: string;
}

export interface Album {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

interface SongContextType {
  songs: Song[];
  song: Song | null;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  loading: boolean;
  selectedSong: string | null;
  setSelectedSong: (id: string) => void;
  albums: Album[];
  fetchSingleSong: () => Promise<void>;
  nextSong: () => void;
  prevSong: () => void;
  albumSong: Song[];
  albumData: Album | null;
  fetchAlbumsSongs: (id: string) => Promise<void>;
  fetchSongs: () => Promise<void>;
  fetchAlbums: () => Promise<void>;
  audioRef: React.RefObject<HTMLAudioElement>; // ✅ ADD: Persistent audio element
}

const SongContext = createContext<SongContextType | undefined>(undefined);

interface SongProviderProps {
  children: ReactNode;
}

export const SongProvider: React.FC<SongProviderProps> = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [song, setSong] = useState<Song | null>(null);
  const [index, setIndex] = useState<number>(0);
  const [albumSong, setAlbumSong] = useState<Song[]>([]);
  const [albumData, setAlbumData] = useState<Album | null>(null);

  // ✅ Persistent Audio Element — page change pe destroy nahi hoga
  const audioRef = useRef<HTMLAudioElement>(new Audio());

  // ✅ isPlaying ka ref — stale closure se bachne ke liye
  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // ✅ Song change hone pe audio src update karo — naya Audio() mat banao
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song?.audio) return;

    audio.src = song.audio;
    audio.load();

    const handleCanPlay = async () => {
      if (isPlayingRef.current) {
        try {
          await audio.play();
        } catch (error) {
          console.error("Auto-play error:", error);
        }
      }
    };

    audio.addEventListener("canplay", handleCanPlay);
    return () => audio.removeEventListener("canplay", handleCanPlay);
  }, [song]);

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      audioRef.current.pause();
    };
  }, []);

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<Song[]>(`${server}/api/v1/song/all`);
      setSongs(data);
      if (data.length > 0) setSelectedSong(data[0].id.toString());
      setIsPlaying(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSingleSong = useCallback(async () => {
    if (!selectedSong) return;
    try {
      const { data } = await axios.get<Song>(
        `${server}/api/v1/song/${selectedSong}`
      );
      setSong(data);
    } catch (error) {
      console.log(error);
    }
  }, [selectedSong]);

  const fetchAlbums = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<Album[]>(`${server}/api/v1/album/all`);
      setAlbums(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const nextSong = useCallback(() => {
    if (index === songs.length - 1) {
      setIndex(0);
      setSelectedSong(songs[0]?.id.toString());
    } else {
      setIndex((prevIndex) => prevIndex + 1);
      setSelectedSong(songs[index + 1]?.id.toString());
    }
  }, [index, songs]);

  const prevSong = useCallback(() => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
      setSelectedSong(songs[index - 1]?.id.toString());
    }
  }, [index, songs]);

  const fetchAlbumsSongs = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get<{ songs: Song[]; album: Album }>(
        `${server}/api/v1/album/${id}`
      );
      setAlbumData(data.album);
      setAlbumSong(data.songs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchSongs(), fetchAlbums()]);
    };
    loadData();
  }, []);

  return (
    <SongContext.Provider
      value={{
        songs,
        selectedSong,
        setSelectedSong,
        isPlaying,
        setIsPlaying,
        loading,
        albums,
        fetchSingleSong,
        song,
        nextSong,
        prevSong,
        fetchAlbumsSongs,
        albumData,
        albumSong,
        fetchSongs,
        fetchAlbums,
        audioRef, // ✅ Context se expose karo
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export const useSongData = (): SongContextType => {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error("useSongData must be used within a SongProvider");
  }
  return context;
};
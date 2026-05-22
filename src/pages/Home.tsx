import Layout from "../components/Layout";
import { useSongData } from "../context/SongContext";
import AlbumCard from "../components/AlbumCard";
import SongCard from "../components/SongCard";
import Loading from "../components/Loading";

const Home = () => {
  const { albums, songs, loading } = useSongData();

  // Helper function: Songs array ko 10-10 ke chunks mein divide karne ke liye
  const chunkSongs = (array: any[], size: number) => {
    if (!array) return [];
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  // Har chunk mein maximum 10 songs honge
  const songRows = chunkSongs(songs || [], 8);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <Layout>
          {/* Featured Charts */}
          <div className="mb-4">
            <h1 className="my-5 font-bold text-2xl"> Featured charts</h1>
            <div className="flex overflow-x-auto hide-horizontal-scroll gap-4">
              {albums?.map((e, i) => {
                return (
                  <AlbumCard
                    key={i}
                    image={e.thumbnail}
                    name={e.title}
                    desc={e.description}
                    id={e.id}
                  />
                );
              })}
            </div>
          </div>

          {/* Today's Biggest Hits */}
          <div className="mb-4 w-full">
            <h1 className="my-5 font-bold text-2xl"> Today's Biggest Hits</h1>
            
            {/* Rows ka main container - Isme gap-6 diya hai taaki dono rows ke beech space rahe */}
            <div className="flex flex-col gap-6">
              {songRows.map((row, rowIndex) => (
                
               
                <div 
                  key={rowIndex} 
                  className="overflow-x-auto hide-horizontal-scroll w-full"
                >
                  {/* Har row ke andar sirf flex use kiya hai taaki 10 cards ek line mein rahein bina size kam hue */}
                  <div className="flex gap-4 min-w-max pb-2">
                    {row.map((e: any, i: number) => {
                      return (
                        <SongCard
                          key={i}
                          image={e.thumbnail}
                          name={e.title}
                          desc={e.description}
                          id={e.id}
                        />
                      );
                    })}
                  </div>
                </div>

              ))}
            </div>
          </div>
        </Layout>
      )}
    </div>
  );
};

export default Home;
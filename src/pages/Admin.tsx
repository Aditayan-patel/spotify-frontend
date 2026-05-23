import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "../context/UserContext";
import { useSongData } from "../context/SongContext";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const server = "http://18.201.42.223:7000";

type Tab = "dashboard" | "addAlbum" | "addSong" | "albums" | "songs";

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useUserData();
  const { albums, songs, fetchAlbums, fetchSongs } = useSongData();

  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [albumTitle, setAlbumTitle] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [albumFile, setAlbumFile] = useState<File | null>(null);
  const [albumPreview, setAlbumPreview] = useState<string | null>(null);

  const [songTitle, setSongTitle] = useState("");
  const [songDescription, setSongDescription] = useState("");
  const [album, setAlbum] = useState("");
  const [songFile, setSongFile] = useState<File | null>(null);

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailTargetId, setThumbnailTargetId] = useState<string | null>(null);

  const [btnLoading, setBtnLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const albumFileHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAlbumFile(file);
    if (file) setAlbumPreview(URL.createObjectURL(file));
  };

  const songFileHandler = (e: ChangeEvent<HTMLInputElement>) => setSongFile(e.target.files?.[0] || null);
  const thumbnailFileHandler = (e: ChangeEvent<HTMLInputElement>) => setThumbnailFile(e.target.files?.[0] || null);

  const addAlbumHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!albumFile) return;
    const formData = new FormData();
    formData.append("title", albumTitle);
    formData.append("description", albumDescription);
    formData.append("file", albumFile);
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/v1/album/new`, formData, {
        headers: { token: localStorage.getItem("token") },
      });
      toast.success(data.message);
      fetchAlbums();
      setAlbumTitle(""); setAlbumDescription(""); setAlbumFile(null); setAlbumPreview(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally { setBtnLoading(false); }
  };

  const addSongHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!songFile) return;
    const formData = new FormData();
    formData.append("title", songTitle);
    formData.append("description", songDescription);
    formData.append("file", songFile);
    formData.append("album", album);
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/v1/song/new`, formData, {
        headers: { token: localStorage.getItem("token") },
        timeout: 600000,
      });
      toast.success(data.message);
      fetchSongs();
      setSongTitle(""); setSongDescription(""); setSongFile(null); setAlbum("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally { setBtnLoading(false); }
  };

  const addThumbnailHandler = async (id: string) => {
    if (!thumbnailFile) return;
    const formData = new FormData();
    formData.append("file", thumbnailFile);
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/v1/song/${id}`, formData, {
        headers: { token: localStorage.getItem("token") },
      });
      toast.success(data.message);
      fetchSongs();
      setThumbnailFile(null); setThumbnailTargetId(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally { setBtnLoading(false); }
  };

  const deleteAlbum = async (id: string) => {
    setBtnLoading(true);
    try {
      const { data } = await axios.delete(`${server}/api/v1/album/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      toast.success(data.message);
      fetchSongs(); fetchAlbums();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally { setBtnLoading(false); setDeleteConfirm(null); }
  };

  const deleteSong = async (id: string) => {
    setBtnLoading(true);
    try {
      const { data } = await axios.delete(`${server}/api/v1/song/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      toast.success(data.message);
      fetchSongs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally { setBtnLoading(false); setDeleteConfirm(null); }
  };

  useEffect(() => {
    if (user && user.role !== "admin") navigate("/");
  }, [user, navigate]);

  const navItems: { id: Tab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "addAlbum", label: "Add Album", icon: "📀" },
    { id: "addSong", label: "Add Song", icon: "🎵" },
    { id: "albums", label: "All Albums", icon: "📚" },
    { id: "songs", label: "All Songs", icon: "🎶" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0a", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", color: "#fff" }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 40 }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: 240, background: "#0f0f0f", borderRight: "1px solid #1a1a1a",
          display: "flex", flexDirection: "column", padding: "24px 0",
          position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
        }}
        className="lg-sidebar"
      >
        {/* Logo */}
        <div style={{ padding: "0 24px 32px", borderBottom: "1px solid #1a1a1a" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "#1db954", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>♪</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: -0.3 }}>SoundAdmin</div>
              <div style={{ fontSize: 11, color: "#535353" }}>Control Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                background: activeTab === item.id ? "#1a1a1a" : "transparent",
                color: activeTab === item.id ? "#1db954" : "#b3b3b3",
                fontSize: 13, fontWeight: activeTab === item.id ? 600 : 400,
                textAlign: "left", marginBottom: 2, transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
              {activeTab === item.id && <div style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: "#1db954" }} />}
            </button>
          ))}
        </nav>

        {/* ✅ "Back to App" HATAYA sidebar bottom se */}
      </aside>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @media (min-width: 1024px) {
          .lg-sidebar { transform: translateX(0) !important; }
          .main-content { margin-left: 240px !important; }
          .mobile-header { display: none !important; }
        }
        .card-hover:hover { background: #1a1a1a !important; transform: translateY(-2px); transition: all 0.2s; }
        .delete-btn:hover { background: #e22c29 !important; }
        .form-input { width: 100%; background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; padding: 12px 14px; color: #fff; font-size: 14px; outline: none; box-sizing: border-box; transition: border-color 0.2s; font-family: inherit; }
        .form-input:focus { border-color: #1db954; }
        .form-input::placeholder { color: #535353; }
        .submit-btn { background: #1db954; color: #000; border: none; border-radius: 25px; padding: 12px 32px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.15s; letter-spacing: 0.5px; }
        .submit-btn:hover:not(:disabled) { background: #1ed760; transform: scale(1.02); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        input[type="file"].form-input { padding: 10px 14px; }
        select.form-input option { background: #1a1a1a; }
        .back-btn:hover { background: #1a1a1a !important; color: #fff !important; }
      `}</style>

      {/* Mobile Header */}
      <header
        className="mobile-header"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, height: 56,
          background: "#0f0f0f", borderBottom: "1px solid #1a1a1a",
          display: "flex", alignItems: "center", padding: "0 16px",
          zIndex: 30, gap: 12,
        }}
      >
        <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer", padding: 4 }}>☰</button>
        <span style={{ fontWeight: 700, fontSize: 16 }}>SoundAdmin</span>

        {/* ✅ "Back to App" — mobile header mein, right side pe */}
        <Link
          to="/"
          className="back-btn"
          style={{
            marginLeft: "auto", display: "flex", alignItems: "center", gap: 6,
            textDecoration: "none", color: "#b3b3b3", fontSize: 12,
            background: "#141414", border: "1px solid #2a2a2a",
            borderRadius: 20, padding: "5px 12px", transition: "all 0.15s",
          }}
        >
          ← App
        </Link>
      </header>

      {/* Main Content */}
      <main className="main-content" style={{ flex: 1, marginLeft: 0, padding: "24px", paddingTop: 80, paddingBottom: 120, maxWidth: "100%" }}>

        {/* ✅ Desktop top bar — page title + "Back to App" button right side pe */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div style={{ fontSize: 13, color: "#535353" }}>
            Admin Panel &rsaquo; <span style={{ color: "#b3b3b3" }}>{navItems.find(n => n.id === activeTab)?.label}</span>
          </div>
          <Link
            to="/"
            className="back-btn"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              textDecoration: "none", color: "#b3b3b3", fontSize: 13,
              background: "#141414", border: "1px solid #2a2a2a",
              borderRadius: 20, padding: "8px 18px", transition: "all 0.15s",
            }}
          >
            ← Back to App
          </Link>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Welcome back 👋</h1>
            <p style={{ color: "#535353", marginBottom: 32, fontSize: 14 }}>Here's what's happening with your music library.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 40 }}>
              {[
                { label: "Total Albums", value: albums?.length ?? 0, icon: "📀", color: "#1db954" },
                { label: "Total Songs", value: songs?.length ?? 0, icon: "🎵", color: "#e25454" },
                { label: "Untagged Songs", value: songs?.filter((s: any) => !s.thumbnail).length ?? 0, icon: "🖼️", color: "#f59e0b" },
              ].map((stat) => (
                <div key={stat.label} style={{ background: "#141414", border: "1px solid #1a1a1a", borderRadius: 12, padding: 20 }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
                  <div style={{ fontSize: 30, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: 13, color: "#535353", marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Quick Actions</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              {[
                { tab: "addAlbum" as Tab, label: "Add New Album", desc: "Upload cover + details", icon: "📀" },
                { tab: "addSong" as Tab, label: "Add New Song", desc: "Upload audio track", icon: "🎵" },
                { tab: "albums" as Tab, label: "Manage Albums", desc: `${albums?.length ?? 0} albums`, icon: "📚" },
                { tab: "songs" as Tab, label: "Manage Songs", desc: `${songs?.length ?? 0} songs`, icon: "🎶" },
              ].map((action) => (
                <button
                  key={action.tab}
                  className="card-hover"
                  onClick={() => setActiveTab(action.tab)}
                  style={{ background: "#141414", border: "1px solid #1a1a1a", borderRadius: 12, padding: 20, textAlign: "left", cursor: "pointer", color: "#fff" }}
                >
                  <div style={{ fontSize: 24, marginBottom: 10 }}>{action.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{action.label}</div>
                  <div style={{ fontSize: 12, color: "#535353" }}>{action.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add Album Tab */}
        {activeTab === "addAlbum" && (
          <div style={{ maxWidth: 560 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Add Album</h1>
            <p style={{ color: "#535353", marginBottom: 28, fontSize: 14 }}>Create a new album with cover art.</p>

            <form onSubmit={addAlbumHandler}>
              <div style={{ display: "flex", gap: 20, marginBottom: 24, alignItems: "flex-start" }}>
                <div style={{ width: 120, height: 120, background: "#1a1a1a", borderRadius: 10, border: "1px solid #2a2a2a", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {albumPreview ? <img src={albumPreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 32 }}>📀</span>}
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                  <input className="form-input" type="text" placeholder="Album title" value={albumTitle} onChange={(e) => setAlbumTitle(e.target.value)} required />
                  <input className="form-input" type="text" placeholder="Description" value={albumDescription} onChange={(e) => setAlbumDescription(e.target.value)} required />
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 12, color: "#535353", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Cover Image</label>
                <input className="form-input" type="file" accept="image/*" onChange={albumFileHandler} required />
              </div>
              <button className="submit-btn" type="submit" disabled={btnLoading}>
                {btnLoading ? "Uploading..." : "Create Album"}
              </button>
            </form>
          </div>
        )}

        {/* Add Song Tab */}
        {activeTab === "addSong" && (
          <div style={{ maxWidth: 560 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Add Song</h1>
            <p style={{ color: "#535353", marginBottom: 28, fontSize: 14 }}>Upload a new track to your library.</p>

            <form onSubmit={addSongHandler}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <input className="form-input" type="text" placeholder="Song title" value={songTitle} onChange={(e) => setSongTitle(e.target.value)} required />
                <input className="form-input" type="text" placeholder="Description" value={songDescription} onChange={(e) => setSongDescription(e.target.value)} required />
                <select className="form-input" value={album} onChange={(e) => setAlbum(e.target.value)} required>
                  <option value="">Select an album</option>
                  {albums?.map((e: any, i: number) => <option value={e.id} key={i}>{e.title}</option>)}
                </select>
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "#535353", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Audio File (max 50MB)</label>
                  <input className="form-input" type="file" accept="audio/*" onChange={songFileHandler} required />
                  {songFile && (
                    <div style={{ marginTop: 6, fontSize: 12, color: "#535353" }}>
                      {songFile.name} — {(songFile.size / (1024 * 1024)).toFixed(1)} MB
                    </div>
                  )}
                </div>
                <button className="submit-btn" type="submit" disabled={btnLoading} style={{ marginTop: 8 }}>
                  {btnLoading ? "Uploading... Please wait" : "Add Song"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Albums Tab */}
        {activeTab === "albums" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 2 }}>Albums</h1>
                <p style={{ color: "#535353", fontSize: 14 }}>{albums?.length ?? 0} albums in your library</p>
              </div>
              <button className="submit-btn" onClick={() => setActiveTab("addAlbum")}>+ Add Album</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
              {albums?.map((e: any, i: number) => (
                <div key={i} className="card-hover" style={{ background: "#141414", border: "1px solid #1a1a1a", borderRadius: 12, overflow: "hidden", position: "relative" }}>
                  <div style={{ position: "relative" }}>
                    <img src={e.thumbnail} alt={e.title} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.8))" }} />
                  </div>
                  <div style={{ padding: "12px 14px 14px" }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.title}</div>
                    <div style={{ fontSize: 12, color: "#535353", marginBottom: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.description}</div>
                    {deleteConfirm === e.id ? (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => deleteAlbum(e.id)} disabled={btnLoading} style={{ flex: 1, background: "#e22c29", color: "#fff", border: "none", borderRadius: 6, padding: "6px 0", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Confirm</button>
                        <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, background: "#2a2a2a", color: "#fff", border: "none", borderRadius: 6, padding: "6px 0", fontSize: 12, cursor: "pointer" }}>Cancel</button>
                      </div>
                    ) : (
                      <button className="delete-btn" onClick={() => setDeleteConfirm(e.id)} disabled={btnLoading} style={{ width: "100%", background: "#1f1f1f", color: "#e22c29", border: "1px solid #2a2a2a", borderRadius: 6, padding: "6px 0", fontSize: 12, cursor: "pointer", transition: "background 0.15s" }}>
                        Delete Album
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {(!albums || albums.length === 0) && (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#535353" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📀</div>
                <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>No albums yet</p>
                <p style={{ fontSize: 13 }}>Add your first album to get started</p>
              </div>
            )}
          </div>
        )}

        {/* Songs Tab */}
        {activeTab === "songs" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 2 }}>Songs</h1>
                <p style={{ color: "#535353", fontSize: 14 }}>{songs?.length ?? 0} tracks in your library</p>
              </div>
              <button className="submit-btn" onClick={() => setActiveTab("addSong")}>+ Add Song</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {songs?.map((e: any, i: number) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 12px", borderRadius: 8, background: "transparent", transition: "background 0.15s" }}
                  onMouseEnter={(ev) => (ev.currentTarget.style.background = "#141414")}
                  onMouseLeave={(ev) => (ev.currentTarget.style.background = "transparent")}
                >
                  <span style={{ width: 24, textAlign: "right", fontSize: 13, color: "#535353", flexShrink: 0 }}>{i + 1}</span>
                  <div style={{ width: 44, height: 44, borderRadius: 6, overflow: "hidden", flexShrink: 0, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {e.thumbnail ? <img src={e.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 18 }}>🎵</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.title}</div>
                    <div style={{ fontSize: 12, color: "#535353", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.description}</div>
                  </div>

                  {!e.thumbnail && (
                    <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                      {thumbnailTargetId === e.id ? (
                        <>
                          <input type="file" onChange={thumbnailFileHandler} style={{ fontSize: 11, color: "#b3b3b3", maxWidth: 120 }} />
                          <button onClick={() => addThumbnailHandler(e.id)} disabled={btnLoading || !thumbnailFile} style={{ background: "#1db954", color: "#000", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                            {btnLoading ? "..." : "Upload"}
                          </button>
                          <button onClick={() => setThumbnailTargetId(null)} style={{ background: "none", border: "none", color: "#535353", cursor: "pointer", fontSize: 18 }}>×</button>
                        </>
                      ) : (
                        <button onClick={() => setThumbnailTargetId(e.id)} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#b3b3b3", borderRadius: 6, padding: "6px 10px", fontSize: 11, cursor: "pointer" }}>
                          + Cover
                        </button>
                      )}
                    </div>
                  )}

                  {deleteConfirm === e.id ? (
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button onClick={() => deleteSong(e.id)} disabled={btnLoading} style={{ background: "#e22c29", color: "#fff", border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Del</button>
                      <button onClick={() => setDeleteConfirm(null)} style={{ background: "#2a2a2a", color: "#fff", border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 12, cursor: "pointer" }}>No</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(e.id)} disabled={btnLoading} style={{ background: "none", border: "none", color: "#535353", fontSize: 18, cursor: "pointer", padding: "4px 6px", flexShrink: 0 }} title="Delete song">
                      🗑
                    </button>
                  )}
                </div>
              ))}
            </div>

            {(!songs || songs.length === 0) && (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#535353" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎵</div>
                <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>No songs yet</p>
                <p style={{ fontSize: 13 }}>Upload your first track to get started</p>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default Admin;
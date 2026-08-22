import { Link, useNavigate  } from "react-router-dom";
import "../css/navbar.css";
import { showGenreMovies } from "../services/api";

function NavBar({
    onGenreChange,
    onTypeChange,
    selectedType,
    resetHome
}) {

    const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="Navbar-Brand">
        <Link
    to="/"
    onClick={resetHome}
>
    A2Z Moviez
</Link>
</div>

      <div className="navbar-links">
        <div className="type-toggle">
            <button
    className="nav-btn"
    onClick={() => {
        onTypeChange("");
        navigate(`/random?refresh=${Date.now()}`);
    }}
>
    🎲 Random Movie
</button>

       {/* <button
    className={`nav-btn ${selectedType === "movie" ? "active-type" : ""}`}
    onClick={() => {
        onTypeChange("movie");
        navigate("/");
    }}
>
    🎬 Movies
</button>

<button
    className={`nav-btn ${selectedType === "anime" ? "active-type" : ""}`}
    onClick={() => {
        onTypeChange("anime");
        navigate("/");
    }}
>
    📺 Anime
</button> */}

<button
    className={`nav-btn ${location.pathname === "/favorites" ? "active-type" : ""}`}
    onClick={() => {
        onTypeChange("");
        navigate("/favorites");
    }}
>
    ❤️ Favorites
</button>

    </div>


  <select
        className="genre-dropdown"
        onChange={(e)=>onGenreChange(e.target.value)}
    >
        <option value="">Genres</option>
    <option value="28">Action</option>
    <option value="12">Adventure</option>
    <option value="16">Animation</option>
    <option value="35">Comedy</option>
    <option value="80">Crime</option>
    <option value="99">Documentary</option>
    <option value="18">Drama</option>
    <option value="10751">Family</option>
    <option value="14">Fantasy</option>
    <option value="36">History</option>
    <option value="27">Horror</option>
    <option value="10402">Music</option>
    <option value="9648">Mystery</option>
    <option value="10749">Romance</option>
    <option value="878">Sci-Fi</option>
    <option value="10770">TV Movie</option>
    <option value="53">Thriller</option>
    <option value="10752">War</option>
    <option value="37">Western</option>
</select>
      </div>
    </nav>
  );
}

export default NavBar;
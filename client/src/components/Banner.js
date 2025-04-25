import { useState } from "react";
import '../stylesheets/Banner.css';

export default function Banner({ currentView, onSearch, goToCreatePost, goToHomePage}) {
    const [searchContent, setSearchContent] = useState("");

    const onEnter = (e) => {
        if (e.key === "Enter") {
            onSearch(searchContent);
        }
    }

    return (
        <header className="banner">
            <div className="banner-content">
                <button className="app-name" onClick={goToHomePage}>phreddit</button>
                <input type="text" className="search-box" placeholder="Search phreddit..." onChange={(e) => setSearchContent(e.target.value)} onKeyDown={onEnter} />
                <button className={currentView === "new-post" ? "active-post-button" : "create-post-button"} onClick={goToCreatePost}>Create Post</button>
            </div>
        </header>
    );
}



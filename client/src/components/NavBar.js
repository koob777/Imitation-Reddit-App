import '../stylesheets/NavBar.css';

export default function NavBar({ currentview, communities, goToCreateCommunityPage, goToCommunityPage, goToHomePage}) {
    return(
        <nav className='nav-bar'>
            <div className='nav-bar-content'>
                <button className={currentview.view === 'home' ? "active-home-button": "home-button"} onClick={goToHomePage}>Home</button>
            </div>
            
            <div className="nav-delimiter"></div>

            <div className="nav-bar-content">
                <h1 className="nav-header">Communities</h1>

                <button className={currentview.view === "new-community" ? "active-community-button": "create-community-button"} onClick={goToCreateCommunityPage}>Create Community</button>

                <ul className="community-list">
                    {
                        communities.map((c) => (
                            <li key={c._id}>
                            <button className={("community" in currentview && currentview.community._id === c._id) ? "active-community" : "community-link"} onClick={() => goToCommunityPage(c)}>
                                {c.name}
                            </button>
                            </li>
                        ))
                    }
                </ul>
            </div>

            <div className="vertical-divider" />
        </nav>
    );
}
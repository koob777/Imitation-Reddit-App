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
                            <a className={("community" in currentview && currentview.community.communityID === c.communityID) ? "active-community" : "community-link"} onClick={() => goToCommunityPage(c)}>
                                {c.name}
                            </a>
                            </li>
                        ))
                    }
                </ul>
            </div>

            <div className="vertical-divider" />
        </nav>
    );
}
import { useState } from "react";
import '../stylesheets/NewPostpage.css';
import axios from 'axios';

export default function NewPostpage({ posts, communities, linkflairs, submitpost, goToHomePage, addnewlinkflair }) {
    const [selectedCommunity, setSelectedCommunity] = useState('');
    const [title, setTitle] = useState('');
    const [existingLinkFlair, setExistingLinkFlair] = useState('');
    const [newLinkFlair, setNewLinkFlair] = useState('');
    const [content, setContent] = useState('');
    const [username, setUsername] = useState('');

    const [communityError, setCommunityError] = useState('');
    const [titleError, setTitleError] = useState('');
    //const [linkFlairError, setLinkFlairError] = useState('');
    const [contentError, setContentError] = useState('');
    const [usernameError, setUsernameError] = useState('');

    const checkinputs = async (e) => {
        e.preventDefault();
        setCommunityError('');
        setTitleError('');
        setContentError('');
        setUsernameError('');

        let output = content;
        let passed = true;

        if (selectedCommunity.trim().length === 0) {
            setCommunityError("A Community needs to be selected");
            passed = false;
        }

        if (title.trim().length === 0) {
            setTitleError("Post title cannot be empty");
            passed = false;
        }

        /*
        let thereislf = true;
        let lk = (existingLinkFlair, newLinkFlair) => {
            if (existingLinkFlair.trim().length === 0 && newLinkFlair.trim().length === 0) {
                thereislf = false;
                return "";
            }
            else if (existingLinkFlair.trim().length === 0 && newLinkFlair.trim().length > 0) {
                return newLinkFlair;
            }
            else if (existingLinkFlair.trim().length > 0 && newLinkFlair.trim().length === 0) {
                return existingLinkFlair;
            }
            else {
                return existingLinkFlair;
            }
        };
        */

        if (content.trim().length === 0) {
            setContentError("Post title cannot be empty");
            passed = false;
        }

        const findLinktextAndURLpattern =  /\[(.*?)\]\((.*?)\)/g;
        const linkpattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
        let box;

        while ((box = findLinktextAndURLpattern.exec(content)) !== null) {
            const linktext = box[1];
            const url = box[2];
    
            if (linktext.trim().length === 0) {
              //commmunitydescription_error.textContent = "Link Text cannot be empty inside []";
              setContentError("Link Text cannot be empty inside []");
              passed = false;
            }
    
            if (url.trim().length === 0 || !(url.startsWith("http://") || url.startsWith("https://"))) {
              //commmunitydescription_error.textContent = "Invalid url inside (). Has to start with http:// or https://";
              setContentError("Invalid url inside (). Has to start with http:// or https://");
              passed = false;
            }
    
            output = output.replace(linkpattern, '<a href="$2" target="_blank">$1</a>');
        }

        if (username.trim().length === 0) {
            //username_error.textContent = "Missing Username";
            setUsernameError("Missing Username");
            passed = false;
        }

        if (passed) {
            let count = posts.length + 1;

            let lfid = 'lf' + (Date.now());
            let flairr = "";
            
            if (existingLinkFlair.trim().length > 0) {
                flairr = existingLinkFlair;
            }
            if (existingLinkFlair.trim().length === 0 && newLinkFlair.trim().length > 0) {
                flairr = newLinkFlair;
            }

            const newPost = {
                postID: 'post' + count,
                title: title,
                content: output,
                linkFlairID: lfid,
                postedBy: username,
                postedDate: new Date(),
                commentIDs: [],
                views: 0,
            }

            if (flairr.trim().length > 0) {
                const newflair = {
                    linkFlairID: lfid,
                    content: flairr,
                };

                //combines adding a new post, a new flair, and going to the homepage 
                submitpost(newPost, newflair, selectedCommunity);
            }
            else {
                submitpost(newPost, null, selectedCommunity);
            }

           try {
            await axios.post('http://localhost:8000/posts', {
              post: newPost,
              flair: (flairr.trim().length > 0 ? {
                linkFlairID: lfid,
                content: flairr
              } : null),
              communityName: selectedCommunity
            });
          
            // Optionally reset state or redirect
            goToHomePage();
          } catch (err) {
            console.error("Failed to create post", err);
          } 
        }
        
          


    };

    return (
        <div className="new-post-page">
            <form onSubmit={checkinputs}>
                <h1 >Create a new Post</h1> <br/>

                <p className="label-info">Choose a Community: (Required)</p>
                <select value={selectedCommunity} onChange={(e) => setSelectedCommunity(e.target.value)}>
                    <option value={""}>---Choose one---</option>
                    {communities.map(community => (
                        <option key={community.communityID} value={community.name}>{community.name}</option>
                    ))}
                </select>
                {communityError && (<p className="red-text">{communityError}</p>)}
                <br/> <br/>


                <p className="label-info">Post title: (Required, max 100 characters)</p>
                <input type="text" className="post-name" maxLength={100} onChange={(e) => setTitle(e.target.value)}></input>
                {titleError && <p className="red-text">{titleError}</p>}
                <br /> <br />


                <p className="label-info">Choose Link Flair: (Optional)</p>
                <select value={existingLinkFlair} onChange={(e) => setExistingLinkFlair(e.target.value)}>
                    <option value={""}>---Create New/None---</option>
                    {linkflairs.map(f => (
                        <option key={f.linkFlairID} value={f.content}>{f.content}</option>
                    ))}
                </select>
                <p className="label-info">Or create one (30 charcters max)</p>
                <input type="text" className="create-link-flair" maxLength={30} onChange={e => setNewLinkFlair(e.target.value)}></input>
                <br /> <br />


                <p className="label-info">Post Content: (Required)</p>
                <input type="text" className="new-post-content" onChange={(e) => setContent(e.target.value)}></input>
                {contentError && <p className="red-text">{contentError}</p>}
                <br /> <br />


                <p className="label-info">Creator Username: (Required)</p>
                <input type="text" className="post-creator" maxLength={100} onChange={(e) => setUsername(e.target.value)}></input>
                {usernameError && <p className="red-text">{usernameError}</p>}
                <br /> <br />


                <button type="submit" className="engender-post-button">Create Post</button>
            </form>
        </div>
    );
}
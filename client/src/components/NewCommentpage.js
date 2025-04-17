import { useState } from "react";
import '../stylesheets/NewCommentpage.css';

export default function NewCommentpage({ isreplyToComment, parentID, submitcomment, sourcepost }) {
    const [content, setContent] = useState('');
    const [username, setUsername] = useState('');

    const [contentError, setContentError] = useState('');
    const [usernameError, setUsernameError] = useState('');

    let checkinputs = (e) => {
        e.preventDefault();
        setContentError('');
        setUsernameError('');

        let output = content;
        let passed = true;

        if (content.trim().length === 0) {
            setContentError("Content cannot be empty");
            passed = false;
        }

        if (username.trim().length === 0) {
            setUsernameError("Username required");
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

        if (passed) {
            let newcomment = {
                commentID: "comment" + (Math.floor(Math.random() * 1000) + 10),
                content: output,
                commentIDs: [],
                commentedBy: username,
                commentedDate: new Date(),
            }

            submitcomment(newcomment, parentID, isreplyToComment, sourcepost);
            setContent('');
            setUsername('');
        }
    };

    return (
        <div className="new-comment">
            <h1>Create a Comment</h1> <br/>

            <form onSubmit={checkinputs}>
                <p className="label-info">Comment Content: (Required)</p>
                <input value={content} type="text" className="new-comment-content" maxLength={500} onChange={(e) => setContent(e.target.value)}></input>
                {contentError && <p className="red-text">{contentError}</p>}
                <br /> <br />

                <p className="label-info">Commentor Username: </p>
                <input value={username} type="text" className="commentor-name" maxLength={100} onChange={(e) => setUsername(e.target.value)}></input>
                {usernameError && <p className="red-text">{usernameError}</p>}
                <br /> <br />

                <button type="submit" className="engender-comment-button">Create Comment</button>
            </form>

        </div>
    );
}
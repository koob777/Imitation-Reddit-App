import { useState } from "react";
import '../stylesheets/NewCommunitypage.css';

export default function NewCommunitypage({ submitcommunity, goToCommunityPage, communities }) {
    const [communityname, setCommunityName] = useState('');
    const [description, setDescription] = useState('');
    const [username, setUsername] = useState('');

    const [nameerror, setNameError] = useState('');
    const [descriptionerror, setDescriptionError] = useState('');
    const [usernameerror, setUsernameError] = useState('');

    const checkinputs = (e) => {
        e.preventDefault();
        setNameError('');
        setDescriptionError('');
        setUsernameError('');
        let output = description;
        let passed = true;

        if (communityname.trim().length === 0) {
            setNameError("Missing Community Name");
            passed = false;
        }

        if (description.trim().length === 0) {
            setDescriptionError("Missing Community Description");
            passed = false;
        }

        const findLinktextAndURLpattern =  /\[(.*?)\]\((.*?)\)/g;
        const linkpattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
        let box;

        while ((box = findLinktextAndURLpattern.exec(description)) !== null) {
            const linktext = box[1];
            const url = box[2];
    
            if (linktext.trim().length === 0) {
              //commmunitydescription_error.textContent = "Link Text cannot be empty inside []";
              setDescriptionError("Link Text cannot be empty inside []");
              passed = false;
            }
    
            if (url.trim().length === 0 || !(url.startsWith("http://") || url.startsWith("https://"))) {
              //commmunitydescription_error.textContent = "Invalid url inside (). Has to start with http:// or https://";
              setDescriptionError("Invalid url inside (). Has to start with http:// or https://");
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
            let count = communities.length + 1;

            let newCommunity = {
              communityID: 'community' + count,
              name: communityname,
              description: output,
              postIDs: [],
              startDate: new Date(),
              members: [username],
              memberCount: 1,
            };


            //maybe combine both into one
            submitcommunity(newCommunity);
        }
    };

    return (
        <div className="new-community-page">
            <form onSubmit={checkinputs}>
                <h1>Create a Community</h1> <br/>

                <p className="label-info">Community Name: (Required, max 100 characters)</p>
                <input type="text" className="new-community-name" maxLength={100} onChange={(e) => setCommunityName(e.target.value)}></input>
                {nameerror && <p className="red-text">{nameerror}</p>}
                <br /> <br />

                <p className="label-info">Community Description: (Required, max 500 characters)</p>
                <input type="text" className="new-community-descr" maxLength={500} onChange={(e) => setDescription(e.target.value)}></input>
                {descriptionerror && <p className="red-text">{descriptionerror}</p>}
                <br /> <br />

                <p className="label-info">Creator Username: (Required)</p>
                <input type="text" className="new-community-creator" maxLength={100} onChange={(e) => setUsername(e.target.value)}></input>
                {usernameerror && <p className="red-text">{usernameerror}</p>}
                <br /> <br />


                <button type="submit" className="engender-community-button">Create Community</button>
            </form>
        </div>
    );
}
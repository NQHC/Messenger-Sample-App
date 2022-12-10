
import '../pages/Styles.css';
import React, { useEffect, useState } from 'react';

export default function Tag({ TagName, setTags, taglist }) {
  const [reset, setReset] = useState(false);
  const addOrRemove = (tag) => {

    const newTags = [...taglist];
    const index = newTags.indexOf(tag);
    if (index === -1) {
      newTags.push(tag);
    } else {
      newTags.splice(index, 1);
    }

    setTags(newTags);
    // console.log("Tags: " + taglist)
  }
  useEffect(() => {
    if (taglist.length == 0) {
      setReset(true);
    }
  }, [taglist]);
  useEffect(() => {
    if (reset == true) {
      setReset(false);
    }
  }, [reset]);

  if (reset) {
    return (
      <div></div>
    )
  }
  else if (taglist.includes(TagName)) {
    return (
      <div>
        <input type="checkbox" id={TagName} className="invisibleCheck" checked readOnly />
        <label htmlFor={TagName} className="tag" onClick={() => addOrRemove(TagName)}>{TagName}</label>

      </div>
    );
  }
  else if ((taglist.length < 3)) {
    return (
      <div>
        <input type="checkbox" id={TagName} className="invisibleCheck" />
        <label htmlFor={TagName} className="tag" onClick={() => addOrRemove(TagName)}>{TagName}</label>

      </div>
    );
  }
  else {
    return (
      <div>
        <label htmlFor={TagName} className="disabledtag">{TagName}</label>
      </div>
    );
  }

}
// <input type="checkbox" id="tags" className="invisibleCheck"  />
//<label for="tags" className = "tag">TEST</label>
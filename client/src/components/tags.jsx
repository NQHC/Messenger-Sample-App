
import '../pages/Styles.css';

export default function Tag({TagName,setTags,taglist}){

    const addOrRemove = (tag) => {

        const newTags = [...taglist];
        const index = newTags.indexOf(tag);
        if (index === -1) {
          console.log("Adding");
          newTags.push(tag);
        } else {
          console.log("Removing");
          newTags.splice(index, 1);
        }
       
        setTags(newTags);
        console.log("Tags: " + taglist)
      }
    if ((taglist.length < 3 || taglist.includes(TagName) )){
        return (
            <div>
            <input type="checkbox" id={TagName} className="invisibleCheck"  />
           <label htmlFor={TagName} className = "tag" onClick={() => addOrRemove(TagName)}>{TagName}</label>
           
            </div>
        );
    }
    else {
    return (
        <div>
        <label htmlFor={TagName} className = "disabledtag">{TagName}</label>
        </div>
    );
    }

}
// <input type="checkbox" id="tags" className="invisibleCheck"  />
//<label for="tags" className = "tag">TEST</label>